"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import SectionTitle from "@/components/SectionTitle";

import {
  Microscope,
  ShieldCheck,
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

function HomeProductCard({ product, district = null }) {
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
    <div className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E8D3BC] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C05800] hover:shadow-lg hover:shadow-[#E8D3BC]/60">
      {/* IMAGE */}
      <Link href={productLink}>
        <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-[#FDFBD4] p-5">
          <Image
            src={imageUrl}
            alt={product.title || "Biomedical Equipment"}
            width={400}
            height={320}
            unoptimized
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={productLink}>
          <h3 className="line-clamp-2 min-h-[50px] text-lg font-bold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-[#C05800]">
            {product.title || "Biomedical Equipment"}
          </h3>
        </Link>

        {/* BRAND + MODEL */}
        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-semibold text-slate-500">
              Brand:
            </span>
            <span className="line-clamp-1 text-xs font-semibold text-[#C05800]">
              {product.brand || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-semibold text-slate-500">
              Model:
            </span>
            <span className="line-clamp-1 text-xs font-medium text-slate-700">
              {product.model || "N/A"}
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-auto pt-4">
          <Link
            href={productLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C05800] px-4 py-2.5 text-sm font-semibold !text-white transition-all duration-300 hover:bg-[#713600] hover:shadow-md hover:shadow-[#C05800]/20"
          >
            <span className="!text-white">Explore Product</span>
            <ArrowRight size={15} className="!text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   HOME CLIENT COMPONENT
========================================================== */

export default function HomeClient({
  initialHero = {},
  initialServices = [],
  initialProducts = [],
  district = "",
  city = "",
}) {
  const [heroData] = useState(initialHero || {});
  const [products] = useState(initialProducts || []);

  const currentDistrict = district || "";
  const currentCity =
    city ||
    (currentDistrict
      ? currentDistrict
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "");

  const makeLink = (path) => {
    if (!currentDistrict) return path;
    if (path === "/") return `/${currentDistrict}`;
    return `/${currentDistrict}${path}`;
  };

  const featuredProducts = products
    .filter((product) => product && product.title)
    .slice(0, 3);

  return (
    <>
      {/* ====================================================
          COMPACT HERO BANNER
      ==================================================== */}
      <section className="bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              {/* SMALL BADGE */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#E8D3BC] bg-[#FDFBD4] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C05800]">
                <span className="h-2 w-2 rounded-full bg-[#C05800]" />
                Laboratory & Diagnostic Supply Hub
              </div>

              {/* TITLE */}
              <h1 className="max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#5B4634] sm:text-3xl lg:text-4xl xl:text-[40px]">
                {heroData.title ||
                  "Advanced Laboratory & Diagnostic Supply Hub For Modern Healthcare"}
              </h1>

              {/* CITY */}
              {currentCity && (
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C05800]" />
                  <p className="text-sm font-bold text-[#C05800] sm:text-base">
                    Serving Healthcare Professionals in {currentCity}
                  </p>
                </div>
              )}

              {/* DESCRIPTION */}
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm md:text-[15px] sm:leading-normal">
                {heroData.description ||
                  "Reliable biomedical equipment, laboratory solutions and professional support for hospitals, laboratories and healthcare institutions."}
              </p>

              {/* BUTTONS */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link
                  href={makeLink("/items")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C05800] px-5 py-2.5 text-sm font-semibold !text-white shadow-md shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#713600] hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                >
                  <span className="!text-white">
                    {heroData.button1Text || "Explore Products"}
                  </span>
                  <ArrowRight size={16} className="!text-white" />
                </Link>

                <Link
                  href={makeLink("/contact")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-2.5 text-sm font-semibold text-[#C05800] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C05800] hover:bg-white sm:px-6 sm:py-3 sm:text-base"
                >
                  {heroData.button2Text || "Contact Us"}
                </Link>
              </div>

              {/* STATS */}
              <div className="mt-5 grid max-w-xl grid-cols-2 border-t border-[#E8D3BC] pt-3.5 sm:grid-cols-4">
                <div className="border-b border-[#E8D3BC] pb-2.5 sm:border-b-0 sm:border-r sm:pb-0">
                  <p className="text-xl font-black text-[#C05800] sm:text-2xl">
                    5000+
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    Happy Clients
                  </p>
                </div>

                <div className="border-b border-[#E8D3BC] pb-2.5 pl-3 sm:border-b-0 sm:border-r sm:pb-0">
                  <p className="text-xl font-black text-[#C05800] sm:text-2xl">
                    3500+
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    Products
                  </p>
                </div>

                <div className="pt-2.5 sm:border-r sm:border-[#E8D3BC] sm:pt-0 sm:pl-3">
                  <p className="text-xl font-black text-[#C05800] sm:text-2xl">
                    10+
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    Years Experience
                  </p>
                </div>

                <div className="pt-2.5 pl-3 sm:pt-0">
                  <p className="text-xl font-black text-[#C05800] sm:text-2xl">
                    24/7
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    Support
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="relative overflow-hidden rounded-[24px] border border-[#E8D3BC] bg-[#FDFBD4] p-3 shadow-md sm:p-4">
                {/* TOP LABEL */}
                <div className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-3 py-1 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C05800]" />
                    <span className="text-[11px] font-bold text-[#5B4634]">
                      Trusted Technology
                    </span>
                  </div>
                </div>

                {/* IMAGE */}
                <div className="relative flex h-[200px] items-center justify-center sm:h-[250px] lg:h-[280px]">
                  <Image
                    src="/home.png"
                    alt="Biomedical Equipment and Healthcare Solutions"
                    width={900}
                    height={550}
                    priority
                    className="relative z-10 h-full w-full object-contain transition duration-500 hover:scale-105"
                  />
                </div>

                {/* BOTTOM CARD */}
                <div className="relative z-20 mt-1 rounded-xl border border-[#E8D3BC] bg-white p-3 shadow-sm sm:p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#C05800]">
                        Healthcare Solutions
                      </p>
                      <h3 className="mt-0.5 text-xs font-bold text-[#5B4634] sm:text-sm">
                        Reliable Technology For Modern Healthcare
                      </h3>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDFBD4] text-[#C05800] sm:h-9 sm:w-9">
                      <Activity size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <p className="sr-only">
        This platform covers laboratory, diagnostic, testing and healthcare products across categories.
      </p>

      {/* ====================================================
          TRUST
      ==================================================== */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-custom">
          <div className="text-center">
            <span className="rounded-full bg-[#FDFBD4] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C05800]">
              TRUSTED ACROSS INDIA
            </span>

            <h2 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
              Trusted By Hospitals, Laboratories & Healthcare Professionals
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Delivering reliable biomedical equipment with quality, innovation and professional service support.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
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
                <div
                  key={index}
                  className="group rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] p-6 transition duration-300 hover:-translate-y-1.5 hover:bg-[#C05800] hover:text-white"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon size={24} className="text-[#C05800]" />
                  </div>

                  <h3 className="mt-5 text-3xl font-black">
                    {item.number}
                  </h3>

                  <p className="mt-1.5 text-sm text-slate-600 group-hover:text-white">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          FEATURED PRODUCTS (INSTANT LOAD)
      ==================================================== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            badge="Featured Products"
            title="Popular Biomedical Equipment"
            description="Explore selected biomedical and diagnostic equipment from our complete product catalog."
            center
          />

          {featuredProducts.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <HomeProductCard
                  key={
                    product.uid ||
                    product.slug ||
                    product.id ||
                    product.title
                  }
                  product={product}
                  district={currentDistrict || null}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[24px] border border-[#E8D3BC] bg-[#FDFBD4] p-10 text-center">
              <p className="text-base font-semibold text-[#5B4634]">
                No products found in the catalog.
              </p>
            </div>
          )}

          {/* VIEW ALL */}
          <div className="mt-10 text-center">
            <Link
              href={makeLink("/items")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C05800] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#713600] hover:shadow-md"
            >
              <span className="!text-white">View All Products</span>
              <ArrowRight size={16} className="!text-white" />
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

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ShieldCheck size={26} />,
                title: "Quality Equipment",
                description:
                  "Reliable biomedical products selected for healthcare and laboratory applications.",
              },
              {
                icon: <Truck size={26} />,
                title: "Delivery Support",
                description:
                  "Professional coordination for smooth and dependable product delivery.",
              },
              {
                icon: <Wrench size={26} />,
                title: "Technical Assistance",
                description:
                  "Practical guidance and support for equipment-related requirements.",
              },
              {
                icon: <Activity size={26} />,
                title: "Healthcare Focus",
                description:
                  "Solutions designed around real laboratory and diagnostic workflows.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-[#E8D3BC] bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C05800] hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#C05800]">
                  {item.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
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

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Consultation",
                desc: "Understanding healthcare requirements, laboratory needs and recommending the most suitable biomedical solutions.",
              },
              {
                step: "02",
                title: "Implementation",
                desc: "Supplying, installing and configuring biomedical equipment with complete technical guidance.",
              },
              {
                step: "03",
                title: "Support",
                desc: "Providing ongoing maintenance, expert assistance and after-sales support for long-term reliability.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[24px] border border-[#E8D3BC] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C05800] hover:shadow-lg"
              >
                <span className="text-5xl font-black text-[#E8D3BC] transition group-hover:text-[#C05800]">
                  {item.step}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>

                <div className="mt-6 h-1 w-14 rounded-full bg-[#C05800] transition-all duration-300 group-hover:w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          AFTER SALES SUPPORT
      ==================================================== */}
      <section className="section-padding bg-gradient-to-b from-white to-[#FDFBD4]">
        <div className="container-custom">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full border border-[#E8D3BC] bg-[#FDFBD4] px-4 py-1.5 text-xs font-bold text-[#C05800]">
                After-Sales Support
              </span>

              <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
                Support That Continues After Installation
              </h2>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                Biomedical equipment requires proper coordination, maintenance and technical attention throughout its working life. Our support approach is designed to help healthcare facilities maintain dependable equipment performance.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  "Installation and setup coordination",
                  "Equipment usage and application guidance",
                  "Maintenance assistance and technical coordination",
                  "Product-related troubleshooting support",
                  "Ongoing communication with healthcare teams",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C05800] text-white">
                      <ShieldCheck size={13} />
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E8D3BC] bg-white p-6 shadow-md md:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#C05800] text-white shadow-md shadow-[#C05800]/20">
                <Headphones size={26} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Need Help With Your Biomedical Equipment?
              </h3>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                Whether you are planning a new laboratory setup, replacing existing equipment or looking for technical assistance, our team can help you understand the available options.
              </p>

              <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                <div className="rounded-xl bg-[#FDFBD4] p-4">
                  <p className="text-xs font-semibold text-[#C05800]">
                    Equipment
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    Product Guidance
                  </p>
                </div>

                <div className="rounded-xl bg-[#FDFBD4] p-4">
                  <p className="text-xs font-semibold text-[#C05800]">
                    Support
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
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
          <div className="rounded-[28px] border border-[#E8D3BC] bg-gradient-to-br from-[#FDFBD4] via-white to-[#FDFBD4] p-6 text-center shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              A Reliable Partner For Laboratory & Diagnostic Supply Hub
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-600">
              From laboratory requirements and diagnostic equipment to installation coordination and ongoing assistance, we focus on delivering practical solutions that support efficient healthcare operations.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {[
                "Biomedical Equipment",
                "Laboratory Solutions",
                "Technical Support",
                "Healthcare Solutions",
              ].map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#C05800] shadow-sm ring-1 ring-[#E8D3BC]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
