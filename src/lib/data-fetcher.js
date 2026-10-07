import fallbackData from "@/data/fallbackData.json";

const clientMemoryCache = new Map();
const inFlightClientRequests = new Map();
const CLIENT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// Seed client memory cache
if (fallbackData?.catalog?.length) {
  clientMemoryCache.set("/api/catalog", {
    data: fallbackData.catalog,
    timestamp: Date.now(),
  });
}
if (fallbackData?.home) {
  clientMemoryCache.set("/api/site-data?path=__website__%2Fpages%2Fhome", {
    data: fallbackData.home,
    timestamp: Date.now(),
  });
  clientMemoryCache.set("/api/site-data?type=home&pageType=home", {
    data: fallbackData.home,
    timestamp: Date.now(),
  });
}
if (fallbackData?.services) {
  clientMemoryCache.set("/api/site-data?path=__website__%2Fpages%2Fservices", {
    data: fallbackData.services,
    timestamp: Date.now(),
  });
  clientMemoryCache.set("/api/site-data?type=services&pageType=services", {
    data: fallbackData.services,
    timestamp: Date.now(),
  });
}
if (fallbackData?.contact) {
  clientMemoryCache.set("/api/site-data?path=__website__%2Fpages%2Fcontact", {
    data: fallbackData.contact,
    timestamp: Date.now(),
  });
  clientMemoryCache.set("/api/site-data?type=contact&pageType=contact", {
    data: fallbackData.contact,
    timestamp: Date.now(),
  });
}

const parseResponse = async (response) => {
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok || body?.ok === false) {
    const message = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`API ${response.status}: ${message}`);
  }
  return body;
};

const get = async (url) => {
  const cached = clientMemoryCache.get(url);
  const isFresh = cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL;

  const doFetch = async () => {
    if (inFlightClientRequests.has(url)) {
      return inFlightClientRequests.get(url);
    }

    const promise = fetch(url, {
      headers: { Accept: "application/json" },
    })
      .then(parseResponse)
      .then((data) => {
        clientMemoryCache.set(url, { data, timestamp: Date.now() });
        inFlightClientRequests.delete(url);
        return data;
      })
      .catch((err) => {
        inFlightClientRequests.delete(url);
        if (cached?.data) return cached.data;
        throw err;
      });

    inFlightClientRequests.set(url, promise);
    return promise;
  };

  if (isFresh) {
    return cached.data;
  }

  if (cached) {
    doFetch().catch(() => {});
    return cached.data;
  }

  return doFetch();
};

export async function fetchDocCached(path) {
  try {
    const url = `/api/site-data?path=${encodeURIComponent(path)}`;
    return await get(url);
  } catch (error) {
    console.warn(`[data-fetcher] ${path}`, error.message);
    return null;
  }
}

export async function fetchFullCatalog() {
  try {
    const body = await get("/api/catalog");
    const products =
      body?.products ?? body?.data?.products ?? body?.data ?? body;
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }
    return fallbackData?.catalog || [];
  } catch (error) {
    console.warn("[data-fetcher] catalog fetch failed, using fallback:", error.message);
    return fallbackData?.catalog || [];
  }
}

export const fetchHomeData = () => fetchDocCached("__website__/pages/home");
export const fetchContactData = () => fetchDocCached("__website__/pages/contact");
export const fetchServicesData = () => fetchDocCached("__website__/pages/services");
export const fetchDistrictData = (district) =>
  fetchDocCached(`__website__/districts/${encodeURIComponent(district || "")}`);

export async function fetchAllDistricts() {
  try {
    return await get("/api/site-data?districts=1");
  } catch (error) {
    console.warn("[data-fetcher] districts", error.message);
    return [];
  }
}

export const fetchActiveDistricts = fetchAllDistricts;

export function subscribeToCatalog(onUpdate, intervalMs = 60000) {
  let active = true;
  let lastSignature = "";

  const emit = async () => {
    try {
      const products = await fetchFullCatalog();
      if (!active) return;
      const signature = JSON.stringify(
        products.map((p) => [p.id, p.slug, p.updatedAt, p.updated_at])
      );
      if (signature !== lastSignature) {
        lastSignature = signature;
        onUpdate(products);
      }
    } catch (error) {
      console.warn("[data-fetcher] catalog polling", error.message);
    }
  };

  emit();
  const timer = setInterval(emit, intervalMs);
  return () => {
    active = false;
    clearInterval(timer);
  };
}
