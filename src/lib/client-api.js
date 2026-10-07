"use client";

import fallbackData from "@/data/fallbackData.json";

export const db = Object.freeze({ source: "admin-api" });

export function doc(_db, ...segments) {
  return { kind: "doc", path: segments.filter(Boolean).map(String) };
}

export function collection(_db, ...segments) {
  return { kind: "collection", path: segments.filter(Boolean).map(String) };
}

function pageForPath(path) {
  const parts = path || [];
  if (parts[0] === "websites" && parts[2] === "pages" && parts[3]) return { type: parts[3], pageType: parts[3] };
  if (parts[0] === "websites" && parts[2] === "districts" && parts[3]) return { type: "district", pageType: "district", district: parts[3] };
  if (parts[0] === "__website__" && parts[1] === "pages" && parts[2]) return { type: parts[2], pageType: parts[2] };
  if (parts[0] === "__website__" && parts[1] === "districts" && parts[2]) return { type: "district", pageType: "district", district: parts[2] };
  return null;
}

function getFallbackDoc(query) {
  if (!query) return null;
  const type = query.type || query.pageType;
  if (type === "home") return fallbackData?.home || null;
  if (type === "services") return fallbackData?.services || null;
  if (type === "contact") return fallbackData?.contact || null;
  return null;
}

const clientApiCache = new Map();
const inFlightPromises = new Map();
const CLIENT_TTL = 3 * 60 * 1000;

// Initialize cache with fallback
if (fallbackData?.home) {
  clientApiCache.set("type=home&pageType=home", { data: fallbackData.home, timestamp: Date.now() });
}
if (fallbackData?.services) {
  clientApiCache.set("type=services&pageType=services", { data: fallbackData.services, timestamp: Date.now() });
}
if (fallbackData?.contact) {
  clientApiCache.set("type=contact&pageType=contact", { data: fallbackData.contact, timestamp: Date.now() });
}
if (fallbackData?.catalog) {
  clientApiCache.set("/api/catalog", { data: { products: fallbackData.catalog }, timestamp: Date.now() });
}

async function readJson(url, options = {}) {
  const cacheKey = url;
  const method = (options.method || "GET").toUpperCase();

  if (method !== "GET") {
    const response = await fetch(url, {
      ...options,
      headers: { Accept: "application/json", ...(options.headers || {}) },
    });
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    if (!response.ok || body?.ok === false) throw new Error(`API ${response.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
    return body;
  }

  const cached = clientApiCache.get(cacheKey);
  const isFresh = cached && Date.now() - cached.timestamp < CLIENT_TTL;

  const execute = async () => {
    if (inFlightPromises.has(cacheKey)) return inFlightPromises.get(cacheKey);

    const promise = fetch(url, {
      ...options,
      headers: { Accept: "application/json", ...(options.headers || {}) },
    })
      .then(async (response) => {
        const text = await response.text();
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch { body = text; }
        if (!response.ok || body?.ok === false) throw new Error(`API ${response.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
        clientApiCache.set(cacheKey, { data: body, timestamp: Date.now() });
        inFlightPromises.delete(cacheKey);
        return body;
      })
      .catch((err) => {
        inFlightPromises.delete(cacheKey);
        if (cached?.data) return cached.data;
        throw err;
      });

    inFlightPromises.set(cacheKey, promise);
    return promise;
  };

  if (isFresh) return cached.data;
  if (cached) {
    execute().catch(() => {});
    return cached.data;
  }

  return execute();
}

export async function getDoc(reference) {
  const query = pageForPath(reference?.path);
  if (!query) return { exists: () => false, data: () => undefined, id: reference?.path?.at(-1) || "" };
  
  const params = new URLSearchParams(query);
  const cacheKeyParam = params.toString();
  const cached = clientApiCache.get(cacheKeyParam);
  const fallback = getFallbackDoc(query);

  if (cached?.data) {
    // Return cached immediately and refresh in background
    readJson(`/api/site-data?${cacheKeyParam}`).then((body) => {
      const data = body?.data ?? body ?? null;
      if (data) clientApiCache.set(cacheKeyParam, { data, timestamp: Date.now() });
    }).catch(() => {});
    return { exists: () => true, data: () => cached.data, id: reference.path.at(-1) || "" };
  }

  if (fallback) {
    clientApiCache.set(cacheKeyParam, { data: fallback, timestamp: Date.now() });
    readJson(`/api/site-data?${cacheKeyParam}`).then((body) => {
      const data = body?.data ?? body ?? null;
      if (data) clientApiCache.set(cacheKeyParam, { data, timestamp: Date.now() });
    }).catch(() => {});
    return { exists: () => true, data: () => fallback, id: reference.path.at(-1) || "" };
  }

  try {
    const body = await readJson(`/api/site-data?${cacheKeyParam}`);
    const data = body?.data ?? body ?? null;
    return { exists: () => data !== null && data !== undefined, data: () => data, id: reference.path.at(-1) || "" };
  } catch (err) {
    return { exists: () => false, data: () => undefined, id: reference.path.at(-1) || "" };
  }
}

function snapshotFromRows(rows) {
  const safe = Array.isArray(rows) ? rows : [];
  const docs = safe.map((row, index) => {
    const data = row?.data ?? row ?? {};
    const id = row?.id || data?.id || data?.uid || data?.productId || data?.slug || `row-${index}`;
    return { id, data: () => data, exists: () => true };
  });
  return { docs, empty: docs.length === 0, size: docs.length, forEach: (fn) => docs.forEach(fn) };
}

export async function getDocs(reference) {
  const path = reference?.path || [];
  if (path[0] === "websites" && path[2] === "districts") {
    try {
      const body = await readJson("/api/site-data?districts=1");
      return snapshotFromRows(body?.data?.districts ?? body?.districts ?? body?.data ?? body);
    } catch {
      return snapshotFromRows([]);
    }
  }
  try {
    const body = await readJson("/api/catalog");
    const rows = body?.products ?? body?.data?.products ?? body?.data ?? body;
    return snapshotFromRows(Array.isArray(rows) && rows.length > 0 ? rows : fallbackData?.catalog || []);
  } catch {
    return snapshotFromRows(fallbackData?.catalog || []);
  }
}

export async function addDoc(reference, data = {}) {
  const path = reference?.path || [];
  const last = path.at(-1);
  const endpoint = last === "contactQueries" ? "/api/contact-query" : last === "productQueries" ? "/api/product-query" : "/api/contact-query";
  const result = await readJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { id: result?.id || result?.data?.id || `query-${Date.now()}`, ...result };
}

export function onSnapshot(reference, onNext, onError) {
  let active = true;
  let timer = null;
  const run = async () => {
    try {
      const snapshot = await getDocs(reference);
      if (active) onNext(snapshot);
    } catch (error) {
      if (active && onError) onError(error);
    }
  };
  run();
  timer = setInterval(run, 60000);
  return () => { active = false; if (timer) clearInterval(timer); };
}
