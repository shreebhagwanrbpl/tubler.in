import {
  fetchHomeData,
  fetchServicesData,
  fetchFullCatalog,
} from "@/lib/data-fetcher-server";
import HomeClient from "./HomeClient";

export const revalidate = 300; // 5 minutes cache revalidation

export default async function HomePage({ district = "", city = "" }) {
  const [heroData, servicesData, allProducts] = await Promise.all([
    fetchHomeData().catch(() => null),
    fetchServicesData().catch(() => null),
    fetchFullCatalog().catch(() => []),
  ]);

  return (
    <HomeClient
      initialHero={heroData || {}}
      initialServices={servicesData?.services || []}
      initialProducts={allProducts || []}
      district={district}
      city={city}
    />
  );
}