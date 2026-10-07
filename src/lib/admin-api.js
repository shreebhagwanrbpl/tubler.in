import "server-only";

import { WEBSITE_ID, COMPANY_ID } from "./catalog-utils";
import fallbackData from "@/data/fallbackData.json";

export const ADMIN_API_BASE_URL = (
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  "https://admin.rajbiosis.app"
).replace(/\/+$/, "");

// In-memory cache for fast responses
const memoryCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Initialize cache with fallback data
if (fallbackData?.catalog?.length) {
  memoryCache.set(
    `/api/catalog?websiteId=${WEBSITE_ID}&companyId=${COMPANY_ID}`,
    { data: { products: fallbackData.catalog }, timestamp: Date.now() }
  );
}
if (fallbackData?.home) {
  memoryCache.set(
    `/api/site-data?websiteId=${WEBSITE_ID}&companyId=${COMPANY_ID}&type=home&pageType=home`,
    { data: { data: fallbackData.home }, timestamp: Date.now() }
  );
}
if (fallbackData?.services) {
  memoryCache.set(
    `/api/site-data?websiteId=${WEBSITE_ID}&companyId=${COMPANY_ID}&type=services&pageType=services`,
    { data: { data: fallbackData.services }, timestamp: Date.now() }
  );
}
if (fallbackData?.contact) {
  memoryCache.set(
    `/api/site-data?websiteId=${WEBSITE_ID}&companyId=${COMPANY_ID}&type=contact&pageType=contact`,
    { data: { data: fallbackData.contact }, timestamp: Date.now() }
  );
}

function buildUrl(pathname, params = {}) {
  const path = String(pathname || "");
  const url = new URL(
    `${ADMIN_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  );

  const query = {
    websiteId: WEBSITE_ID,
    companyId: COMPANY_ID,
    ...params,
  };

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

function getFallbackForRequest(pathname, params = {}) {
  if (pathname === "/api/catalog" || pathname.includes("catalog")) {
    return { products: fallbackData?.catalog || [] };
  }
  const type = params.type || params.pageType;
  if (type === "home") {
    return { data: fallbackData?.home || null };
  }
  if (type === "services") {
    return { data: fallbackData?.services || null };
  }
  if (type === "contact") {
    return { data: fallbackData?.contact || null };
  }
  return null;
}

async function executeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    if (!response.ok || body?.success === false || body?.ok === false) {
      const message = typeof body === "string" ? body : JSON.stringify(body);
      throw new Error(`Admin API ${response.status}: ${message}`);
    }

    return body;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function adminFetch(pathname, options = {}, params = {}) {
  const method = (options.method || "GET").toUpperCase();

  // For non-GET requests, execute directly
  if (method !== "GET") {
    const url = buildUrl(pathname, params);
    return executeFetch(url, options);
  }

  const url = buildUrl(pathname, params);
  const cacheKey = `${pathname}?${url.searchParams.toString()}`;

  const cached = memoryCache.get(cacheKey);
  const isFresh = cached && Date.now() - cached.timestamp < CACHE_TTL;

  // Background fetch helper
  const triggerBackgroundFetch = () => {
    if (inFlightRequests.has(cacheKey)) return inFlightRequests.get(cacheKey);

    const fetchPromise = executeFetch(url, options)
      .then((data) => {
        memoryCache.set(cacheKey, { data, timestamp: Date.now() });
        inFlightRequests.delete(cacheKey);
        return data;
      })
      .catch((err) => {
        inFlightRequests.delete(cacheKey);
        console.warn(`[admin-api] Background fetch error for ${pathname}:`, err.message);
        return cached?.data || getFallbackForRequest(pathname, params);
      });

    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  };

  // 1. If fresh in memory cache, return immediately (0ms)
  if (isFresh) {
    return cached.data;
  }

  // 2. If cached but stale, trigger background revalidation and return stale data immediately (0ms SWR)
  if (cached) {
    triggerBackgroundFetch();
    return cached.data;
  }

  // 3. If fallback available, cache it, trigger background fetch, and return fallback immediately (0ms)
  const fallback = getFallbackForRequest(pathname, params);
  if (fallback) {
    memoryCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    triggerBackgroundFetch();
    return fallback;
  }

  // 4. If no cache or fallback, await fetch with deduplication
  return triggerBackgroundFetch();
}

export async function postAdminQuery(endpoint, payload = {}) {
  return adminFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      websiteId: WEBSITE_ID,
      companyId: COMPANY_ID,
      ...payload,
    }),
  });
}

export async function fetchCatalogFromAdmin() {
  const response = await adminFetch("/api/catalog");
  const products =
    response?.products ??
    response?.data?.products ??
    response?.data ??
    response;
  return Array.isArray(products) ? products : [];
}
