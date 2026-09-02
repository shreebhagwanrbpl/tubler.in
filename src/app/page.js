"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchFullCatalog } from "@/lib/data-fetcher";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  Wrench,
  Activity,
  Truck,
  Headphones,
} from "lucide-react";

/* ==========================================================
   HOME PRODUCT CARD
========================================================== */

function HomeProductCard({
  product,
  district = null,
}) {
  if (!product) return null;

  const slug =
    product.slug ||
    product.productSlug ||
    product.title
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const productLink = district
    ? `/${district}/items/${slug}`
    : `/items/${slug}`;

  let imageUrl = "/placeholder.png";

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      imageUrl = firstImage;
    } else if (firstImage?.url) {
      imageUrl = firstImage.url;
    } else if (firstImage?.src) {
      imageUrl = firstImage.src;
    }
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  } else if (product.imageURL) {
    imageUrl = product.imageURL;
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E8D3BC] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:shadow-xl hover:shadow-[#E8D3BC]">

      {/* IMAGE */}

      <Link href={productLink}>
        <div className="relative flex h-[250px] items-center justify-center overflow-hidden bg-[#FDFBD4] p-6">

          <Image
            src={imageUrl}
            alt={product.title || "Biomedical Equipment"}
            width={500}
            height={400}
            unoptimized
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />

        </div>
      </Link>

      {/* PRODUCT DETAILS */}

      <div className="flex flex-1 flex-col p-6">

        <Link href={productLink}>
          <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-slate-900 transition-colors duration-300 group-hover:text-[#C05800]">
            {product.title || "Biomedical Equipment"}
          </h3>
        </Link>

        {/* BRAND + MODEL */}

        <div className="mt-5 space-y-2">

          <div className="flex items-center gap-2">

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              Brand:
            </span>

            <span className="line-clamp-1 text-sm font-semibold text-[#C05800]">
              {product.brand || "N/A"}
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              Model:
            </span>

            <span className="line-clamp-1 text-sm font-medium text-slate-700">
              {product.model || "N/A"}
            </span>

          </div>

        </div>

        {/* BUTTON */}

        <div className="mt-auto pt-6">

          <Link
            href={productLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C05800] px-5 py-3 font-semibold !text-white transition-all duration-300 hover:bg-[#713600] hover:shadow-lg hover:shadow-[#C05800]/20"
          >

            <span className="!text-white">
              Explore Product
            </span>

            <ArrowRight
              size={17}
              className="!text-white"
            />

          </Link>

        </div>

      </div>

    </div>
  );
}


/* ==========================================================
   HOME PAGE
========================================================== */

export default function HomePage() {

  const pathname = usePathname();

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });


  /* ========================================================
     CITY / DISTRICT
  ======================================================== */

  const pathParts =
    pathname?.split("/").filter(Boolean) || [];

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const currentDistrict =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const currentCity = currentDistrict
    ? currentDistrict
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
    : "";


  /* ========================================================
     LINK HANDLER
  ======================================================== */

  const makeLink = (path) => {

    if (!currentDistrict) {
      return path;
    }

    if (path === "/") {
      return `/${currentDistrict}`;
    }

    return `/${currentDistrict}${path}`;
  };


  /* ========================================================
     LOAD HERO DATA
  ======================================================== */

  useEffect(() => {

    const loadHero = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "tublerin",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }

      } catch (error) {

        console.error(
          "Hero data error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadHero();

  }, []);


  /* ========================================================
     LOAD SERVICES + PRODUCTS
  ======================================================== */

  useEffect(() => {

    const loadHomeData = async () => {

      try {

        /* SERVICES */

        const serviceSnap = await getDoc(
          doc(
            db,
            "websites",
            "tublerin",
            "pages",
            "services"
          )
        );

        if (serviceSnap.exists()) {

          const serviceData =
            serviceSnap.data();

          setServices(
            Array.isArray(serviceData.services)
              ? serviceData.services
              : []
          );

        }


        /* PRODUCTS */

        const allProducts =
          await fetchFullCatalog();

        const normalizedProducts =
          Array.isArray(allProducts)
            ? allProducts.map((product) => ({
              ...product,

              slug:
                product.slug ||
                product.productSlug ||
                product.title
                  ?.toLowerCase()
                  .trim()
                  .replace(
                    /[^a-z0-9\s-]/g,
                    ""
                  )
                  .replace(
                    /\s+/g,
                    "-"
                  ),
            }))
            : [];

        setProducts(normalizedProducts);

      } catch (error) {

        console.error(
          "Home data error:",
          error
        );

      } finally {

        setProductsLoading(false);

      }

    };

    loadHomeData();

  }, []);


  /* ========================================================
     ONLY 3 PRODUCTS
  ======================================================== */

  const featuredProducts = products
    .filter(
      (product) =>
        product &&
        product.title
    )
    .slice(0, 3);


  /* ========================================================
     ONLY 3 SERVICES
  ======================================================== */

  const featuredServices = services
    .filter(Boolean)
    .slice(0, 3);


  /* ========================================================
     SERVICE ICONS
  ======================================================== */

  const serviceIcons = [
    <Microscope key="microscope" size={30} />,
    <FlaskConical key="flask" size={30} />,
    <ShieldCheck key="shield" size={30} />,
    <Stethoscope key="stethoscope" size={30} />,
    <Wrench key="wrench" size={30} />,
    <Activity key="activity" size={30} />,
  ];


  return (
    <>

      {/* ====================================================
          HERO BANNER
      ==================================================== */}

      <section className="bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-[1450px]">

          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">

            {/* LEFT CONTENT */}

            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >

              {/* SMALL LABEL */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#E8D3BC] bg-[#FDFBD4] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#C05800]">

                <span className="h-2 w-2 rounded-full bg-[#C05800]" />

                Laboratory & Diagnostic Supply Hub

              </div>


              {/* TITLE */}

              {loading ? (

                <div className="animate-pulse space-y-3">

                  <div className="h-12 w-full max-w-2xl rounded-xl bg-[#FDFBD4]" />

                  <div className="h-12 w-4/5 max-w-xl rounded-xl bg-[#FDFBD4]" />

                </div>

              ) : (

                <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-[#5B4634] sm:text-5xl lg:text-6xl">

                  {heroData.title ||
                    "Advanced Laboratory & Diagnostic Supply Hub For Modern Healthcare"}

                </h1>

              )}


              {/* CITY */}

              {currentCity && (

                <div className="mt-5 flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-[#C05800]" />

                  <p className="text-base font-bold text-[#C05800] sm:text-lg">

                    Serving Healthcare Professionals in {currentCity}

                  </p>

                </div>

              )}


              {/* DESCRIPTION */}

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">

                {heroData.description ||
                  "Reliable biomedical equipment, laboratory solutions and professional support for hospitals, laboratories and healthcare institutions."}

              </p>


              {/* BUTTONS */}

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  href={makeLink("/items")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C05800] px-6 py-3.5 font-semibold !text-white shadow-lg shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#713600] hover:shadow-xl"
                >

                  <span className="!text-white">
                    {heroData.button1Text || "Explore Products"}
                  </span>

                  <ArrowRight
                    size={18}
                    className="!text-white"
                  />

                </Link>


                <Link
                  href={makeLink("/contact")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] px-6 py-3.5 font-semibold text-[#C05800] transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800] hover:bg-white"
                >

                  {heroData.button2Text || "Contact Us"}

                </Link>

              </div>


              {/* STATS */}

              <div className="mt-8 grid max-w-xl grid-cols-2 border-t border-[#E8D3BC] pt-6 sm:grid-cols-4">

                <div className="border-b border-[#E8D3BC] pb-4 sm:border-b-0 sm:border-r sm:pb-0">

                  <p className="text-2xl font-black text-[#C05800]">
                    5000+
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Happy Clients
                  </p>

                </div>


                <div className="border-b border-[#E8D3BC] pb-4 pl-4 sm:border-b-0 sm:border-r sm:pb-0">

                  <p className="text-2xl font-black text-[#C05800]">
                    3500+
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Products
                  </p>

                </div>


                <div className="pt-4 sm:border-r sm:border-[#E8D3BC] sm:pt-0 sm:pl-4">

                  <p className="text-2xl font-black text-[#C05800]">
                    10+
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Years Experience
                  </p>

                </div>


                <div className="pt-4 pl-4 sm:pt-0">

                  <p className="text-2xl font-black text-[#C05800]">
                    24/7
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Support
                  </p>

                </div>

              </div>

            </motion.div>


            {/* RIGHT IMAGE */}

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="order-1 lg:order-2"
            >

              <div className="relative overflow-hidden rounded-[32px] border border-[#E8D3BC] bg-[#FDFBD4] p-4 shadow-[0_25px_70px_rgba(192,88,0,0.12)] sm:p-6">

                {/* TOP LABEL */}

                <div className="absolute left-6 top-6 z-20 rounded-full bg-white px-4 py-2 shadow-md">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-[#C05800]" />

                    <span className="text-xs font-bold text-[#5B4634]">
                      Trusted Technology
                    </span>

                  </div>

                </div>


                {/* DECORATIVE SHAPE */}

                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border-[28px] border-[#C05800]/10" />

                <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full border-[30px] border-[#C05800]/10" />


                {/* IMAGE */}

                <div className="relative flex h-[300px] items-center justify-center sm:h-[390px] lg:h-[440px]">

                  <Image
                    src="/home.png"
                    alt="Biomedical Equipment and Healthcare Solutions"
                    width={1400}
                    height={850}
                    priority
                    className="relative z-10 h-full w-full object-contain transition duration-700 hover:scale-105"
                  />

                </div>


                {/* BOTTOM CARD */}

                <div className="relative z-20 rounded-2xl border border-[#E8D3BC] bg-white p-4 shadow-lg sm:p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C05800]">
                        Healthcare Solutions
                      </p>

                      <h3 className="mt-1 text-base font-bold text-[#5B4634] sm:text-lg">
                        Reliable Technology For Modern Healthcare
                      </h3>

                    </div>


                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#C05800] sm:flex">

                      <Activity size={21} />

                    </div>

                  </div>

                </div>


                {/* FLOATING BADGE */}

                <div className="absolute bottom-28 right-5 z-30 hidden rounded-2xl border border-[#E8D3BC] bg-white px-4 py-3 shadow-xl sm:block">

                  <p className="text-xl font-black text-[#C05800]">
                    10+
                  </p>

                  <p className="text-[10px] font-semibold text-slate-500">
                    Years Experience
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>
      </section>
      <p className="sr-only">This platform covers laboratory, diagnostic, testing and healthcare products across categories.</p>



      {/* ====================================================
          TRUST
      ==================================================== */}

      <section className="bg-white py-20">

        <div className="container-custom">

          <div className="text-center">

            <span className="rounded-full bg-[#FDFBD4] px-5 py-2 text-sm font-semibold text-[#C05800]">
              TRUSTED ACROSS INDIA
            </span>

            <h2 className="mt-5 text-4xl font-black text-slate-900">
              Trusted By Hospitals, Laboratories & Healthcare Professionals
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-600">
              Delivering reliable biomedical equipment with quality,
              innovation and professional service support.
            </p>

          </div>


          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                number: "5000+",
                title: "Happy Clients",
                icon: Building2,
              },
              {
                number: "3500+",
                title: "Products",
                icon: Microscope,
              },
              {
                number: "10+",
                title: "Years Experience",
                icon: ShieldCheck,
              },
              {
                number: "24/7",
                title: "Support",
                icon: Truck,
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.15,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="group rounded-3xl border border-[#E8D3BC] bg-[#FDFBD4] p-8 transition duration-300 hover:-translate-y-2 hover:bg-[#C05800] hover:text-white"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">

                    <Icon
                      size={30}
                      className="text-[#C05800]"
                    />

                  </div>

                  <h3 className="mt-8 text-5xl font-black">
                    {item.number}
                  </h3>

                  <p className="mt-3 text-slate-600 group-hover:text-white">
                    {item.title}
                  </p>

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>


      {/* ====================================================
          FEATURED PRODUCTS
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <SectionTitle
            badge="Featured Products"
            title="Popular Biomedical Equipment"
            description="Explore selected biomedical and diagnostic equipment from our complete product catalog."
            center
          />


          {/* LOADING */}

          {productsLoading ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {Array.from({
                length: 3,
              }).map((_, index) => (

                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-[24px] border border-[#E8D3BC] bg-white shadow-md"
                >

                  <div className="h-[250px] bg-[#FDFBD4]" />

                  <div className="p-6">

                    <div className="h-7 w-4/5 rounded bg-[#FDFBD4]" />

                    <div className="mt-5 h-4 w-3/5 rounded bg-[#FDFBD4]" />

                    <div className="mt-3 h-4 w-2/3 rounded bg-[#FDFBD4]" />

                    <div className="mt-6 h-12 w-full rounded-xl bg-[#FDFBD4]" />

                  </div>

                </div>

              ))}

            </div>

          ) : featuredProducts.length > 0 ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {featuredProducts.map(
                (product) => (

                  <HomeProductCard
                    key={
                      product.uid ||
                      product.slug ||
                      product.id ||
                      product.title
                    }
                    product={product}
                    district={
                      currentDistrict ||
                      null
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="mt-16 rounded-[30px] border border-[#E8D3BC] bg-[#FDFBD4] p-12 text-center">

              <p className="text-lg font-semibold text-[#5B4634]">
                No products found in the catalog.
              </p>

            </div>

          )}


          {/* VIEW ALL */}

          <div className="mt-14 text-center">

            <Link
              href={makeLink("/items")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#C05800] px-8 py-4 font-semibold !text-white transition hover:bg-[#713600]"
            >

              <span className="!text-white">
                View All Products
              </span>

              <ArrowRight
                size={18}
                className="!text-white"
              />

            </Link>

          </div>

        </div>

      </section>


      {/* ====================================================
          WHY CHOOSE US
      ==================================================== */}

      <section className="section-padding bg-[#FDFBD4]">

        <div className="container-custom">

          <SectionTitle
            badge="Why Choose Us"
            title="Reliable Solutions For Modern Healthcare"
            description="We combine quality biomedical equipment with professional guidance and dependable customer support."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: (
                  <ShieldCheck size={30} />
                ),
                title: "Quality Equipment",
                description:
                  "Reliable biomedical products selected for healthcare and laboratory applications.",
              },
              {
                icon: (
                  <Truck size={30} />
                ),
                title: "Delivery Support",
                description:
                  "Professional coordination for smooth and dependable product delivery.",
              },
              {
                icon: (
                  <Wrench size={30} />
                ),
                title: "Technical Assistance",
                description:
                  "Practical guidance and support for equipment-related requirements.",
              },
              {
                icon: (
                  <Activity size={30} />
                ),
                title: "Healthcare Focus",
                description:
                  "Solutions designed around real laboratory and diagnostic workflows.",
              },
            ].map(
              (item, index) => (

                <div
                  key={index}
                  className="rounded-[30px] border border-[#E8D3BC] bg-white p-8 text-center shadow-lg shadow-[#E8D3BC] transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:shadow-xl"
                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDFBD4] text-[#C05800]">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          WORKING PROCESS
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <SectionTitle
            badge="How We Work"
            title="A Straightforward Way to Source What You Need"
            description="We follow a streamlined process to deliver reliable biomedical and healthcare solutions with precision and excellence."
            center
          />


          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {[
              {
                step: "01",
                title: "Consultation",
                desc:
                  "Understanding healthcare requirements, laboratory needs and recommending the most suitable biomedical solutions.",
              },
              {
                step: "02",
                title: "Implementation",
                desc:
                  "Supplying, installing and configuring biomedical equipment with complete technical guidance.",
              },
              {
                step: "03",
                title: "Support",
                desc:
                  "Providing ongoing maintenance, expert assistance and after-sales support for long-term reliability.",
              },
            ].map(
              (item, index) => (

                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[30px] border border-[#E8D3BC] bg-white p-8 shadow-lg shadow-[#E8D3BC] transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:shadow-2xl hover:shadow-[#E8D3BC]"
                >

                  <span className="text-6xl font-black text-[#E8D3BC] transition group-hover:text-[#C05800]">
                    {item.step}
                  </span>

                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {item.desc}
                  </p>

                  <div className="mt-8 h-1 w-16 rounded-full bg-[#C05800] transition-all duration-300 group-hover:w-24" />

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          AFTER SALES SUPPORT
      ==================================================== */}

      <section className="section-padding bg-gradient-to-b from-white to-[#FDFBD4]">

        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <span className="inline-block rounded-full border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-2 font-semibold text-[#C05800]">
                After-Sales Support
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Support That Continues After Installation
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Biomedical equipment requires proper coordination, maintenance and technical attention throughout its working life. Our support approach is designed to help healthcare facilities maintain dependable equipment performance.
              </p>


              <div className="mt-8 space-y-5">

                {[
                  "Installation and setup coordination",
                  "Equipment usage and application guidance",
                  "Maintenance assistance and technical coordination",
                  "Product-related troubleshooting support",
                  "Ongoing communication with healthcare teams",
                ].map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >

                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C05800] text-white">

                        <ShieldCheck size={15} />

                      </div>

                      <p className="leading-7 text-slate-700">
                        {item}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="rounded-[35px] border border-[#E8D3BC] bg-white p-8 shadow-xl shadow-[#E8D3BC] md:p-10">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C05800] text-white shadow-lg shadow-[#C05800]/20">

                <Headphones size={30} />

              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-900">
                Need Help With Your Biomedical Equipment?
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Whether you are planning a new laboratory setup, replacing existing equipment or looking for technical assistance, our team can help you understand the available options.
              </p>


              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-[#FDFBD4] p-5">

                  <p className="text-sm font-semibold text-[#C05800]">
                    Equipment
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    Product Guidance
                  </p>

                </div>


                <div className="rounded-2xl bg-[#FDFBD4] p-5">

                  <p className="text-sm font-semibold text-[#C05800]">
                    Support
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    Technical Assistance
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          FINAL CONTENT
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom max-w-5xl">

          <div className="rounded-[35px] border border-[#E8D3BC] bg-gradient-to-br from-[#FDFBD4] via-white to-[#FDFBD4] p-8 text-center shadow-lg shadow-[#E8D3BC] md:p-12">

            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              A Reliable Partner For Laboratory & Diagnostic Supply Hub
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              From laboratory requirements and diagnostic equipment to installation coordination and ongoing assistance, we focus on delivering practical solutions that support efficient healthcare operations.
            </p>


            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#C05800] shadow-sm ring-1 ring-[#E8D3BC]">
                Biomedical Equipment
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#C05800] shadow-sm ring-1 ring-[#E8D3BC]">
                Laboratory Solutions
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#C05800] shadow-sm ring-1 ring-[#E8D3BC]">
                Technical Support
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#C05800] shadow-sm ring-1 ring-[#E8D3BC]">
                Healthcare Solutions
              </span>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}