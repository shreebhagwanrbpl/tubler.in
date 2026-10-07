import { fetchActiveDistricts, fetchFullCatalog } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const now = new Date();
  const urls = [
    { url: "https://tubler.in", lastModified: now },
    { url: "https://tubler.in/about", lastModified: now },
    { url: "https://tubler.in/services", lastModified: now },
    { url: "https://tubler.in/contact", lastModified: now },
    { url: "https://tubler.in/items", lastModified: now },
  ];

  try {
    const districts = await fetchActiveDistricts();
    for (const district of districts) {
      const slug = district?.slug;
      if (!slug) continue;
      for (const path of ["", "/about", "/services", "/contact", "/items"]) {
        urls.push({ url: `https://tubler.in/${slug}${path}`, lastModified: now });
      }
    }
    const products = await fetchFullCatalog();
    for (const product of products) {
      if (!product?.slug) continue;
      urls.push({ url: `https://tubler.in/items/${product.slug}`, lastModified: now });
      for (const district of districts) {
        if (district?.slug) urls.push({ url: `https://tubler.in/${district.slug}/items/${product.slug}`, lastModified: now });
      }
    }
  } catch (error) {
    console.error("Sitemap error:", error);
  }
  return urls;
}
