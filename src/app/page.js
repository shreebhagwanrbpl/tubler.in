"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Wrench,
  Activity,
} from "lucide-react";

import Image from "next/image";
import {



  Truck,
} from "lucide-react";

const stats = [
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
];

export default function HeroSection({
}) {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);
  const [loading, setLoading] = useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });
  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";
  const city = district
    ? district
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {

        // Services

        const serviceSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "services"
          )
        );

        if (serviceSnap.exists()) {
          setServices(serviceSnap.data().services || []);
        }

        // Products

        const productSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "products"
          )
        );

        if (productSnap.exists()) {

          const data = (productSnap.data().products || []).map((item) => ({
            ...item,
            slug:
              item.slug ||
              item.title
                ?.toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-"),
          }));

          setProducts(data);

        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  return (
    <>
   <section className="relative overflow-hidden bg-gradient-to-br from-[#FDFBD4] via-white to-[#F5E8D2]">

  {/* Background */}
  <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C05800]/15 blur-[150px]" />
  <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#713600]/15 blur-[150px]" />

  <div className="container-custom relative py-24">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* Left */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .8 }}
      >

        <span className="inline-flex rounded-full bg-[#F3E4D2] px-5 py-2 text-sm font-semibold text-[#713600] border border-[#C05800]/20">

          India's Trusted Biomedical Partner

        </span>

        <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight text-[#38240D]">

          {loading ? (

            <div className="space-y-4 animate-pulse">

              <div className="h-12 w-3/4 rounded bg-[#F3E4D2]"></div>

              <div className="h-12 w-2/3 rounded bg-[#F3E4D2]"></div>

            </div>

          ) : (

            <>
              {heroData.title}

              {city && (

                <span className="block mt-3 text-2xl lg:text-4xl font-bold text-[#C05800]">

                  in {city}

                </span>

              )}

            </>

          )}

        </h1>

        {loading ? (

          <div className="mt-8 space-y-3 animate-pulse">

            <div className="h-4 rounded bg-[#F3E4D2]"></div>

            <div className="h-4 w-11/12 rounded bg-[#F3E4D2]"></div>

            <div className="h-4 w-8/12 rounded bg-[#F3E4D2]"></div>

          </div>

        ) : (

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#5B4634]">

            {heroData.description}

            {city && (
              <>
                {" "}across <strong>{city}</strong>
              </>
            )}

          </p>

        )}

        <div className="mt-10 flex flex-wrap gap-4">

          {loading ? (

            <>
              <div className="h-14 w-48 animate-pulse rounded-xl bg-[#F3E4D2]"></div>

              <div className="h-14 w-40 animate-pulse rounded-xl bg-[#F3E4D2]"></div>
            </>

          ) : (

            <>
              <Link href={makeLink("/items")}>

                <button className="rounded-xl bg-[#C05800] px-8 py-4 font-semibold text-white transition hover:bg-[#713600]">

                  {heroData.button1Text || "Explore Products"}

                </button>

              </Link>

              <Link href={makeLink("/contact")}>

                <button className="rounded-xl border-2 border-[#C05800] px-8 py-4 font-semibold text-[#713600] transition hover:bg-[#F3E4D2]">

                  {heroData.button2Text || "Get Quote"}

                </button>

              </Link>

            </>

          )}

        </div>

      </motion.div>

      {/* Right */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .2 }}
      >

        <div className="grid grid-cols-2 gap-6">

          <div className="rounded-3xl bg-white p-8 shadow-xl border border-[#E8D3BC]">

            <h2 className="text-5xl font-black text-[#C05800]">
              5000+
            </h2>

            <p className="mt-3 text-[#6B5A4A]">
              Happy Customers
            </p>

          </div>

          <div className="rounded-3xl bg-[#713600] p-8 text-white shadow-xl">

            <h2 className="text-5xl font-black">
              10+
            </h2>

            <p className="mt-3 text-[#FDFBD4]">
              Years Experience
            </p>

          </div>

          <div className="col-span-2 rounded-3xl bg-white p-8 shadow-xl border border-[#E8D3BC]">

            <h3 className="text-2xl font-bold text-[#38240D]">

              Why Customers Choose Us

            </h3>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E4D2] text-[#C05800]">

                  ✅

                </div>

                <div>

                  <h4 className="font-semibold text-[#38240D]">

                    Premium Quality

                  </h4>

                  <p className="text-sm text-[#6B5A4A]">

                    Genuine biomedical equipment.

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E4D2] text-[#C05800]">

                  🚚

                </div>

                <div>

                  <h4 className="font-semibold text-[#38240D]">

                    Fast Delivery

                  </h4>

                  <p className="text-sm text-[#6B5A4A]">

                    Delivery across India.

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E4D2] text-[#C05800]">

                  🛠

                </div>

                <div>

                  <h4 className="font-semibold text-[#38240D]">

                    Service Support

                  </h4>

                  <p className="text-sm text-[#6B5A4A]">

                    Installation & maintenance.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  </div>

</section>
    <section className="bg-[#FDFBD4] py-20">

  <div className="container-custom">

    {/* Heading */}

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: .6 }}
      viewport={{ once: true }}
      className="text-center"
    >

      <span className="rounded-full border border-[#C05800]/20 bg-[#F3E4D2] px-5 py-2 text-sm font-semibold text-[#713600]">

        TRUSTED ACROSS INDIA

      </span>

      <h2 className="mt-5 text-4xl font-black text-[#38240D]">

        Trusted By Hospitals,
        Laboratories & Healthcare Professionals

      </h2>

      <p className="mx-auto mt-5 max-w-3xl leading-8 text-[#5B4634]">

        Delivering reliable biomedical equipment with quality,
        innovation and nationwide service support.

      </p>

    </motion.div>

    {/* Stats */}

    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item, index) => {
        const Icon = item.icon;

        return (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * .15 }}
            viewport={{ once: true }}
            className="group rounded-3xl border border-[#E8D3BC] bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-[#713600] hover:text-white hover:shadow-2xl"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3E4D2] shadow-md transition-all duration-300 group-hover:bg-[#C05800]">

              <Icon
                size={30}
                className="text-[#C05800] transition-colors duration-300 group-hover:text-white"
              />

            </div>

            <h3 className="mt-8 text-5xl font-black text-[#38240D] group-hover:text-[#FDFBD4]">

              {item.number}

            </h3>

            <p className="mt-3 text-[#5B4634] transition-colors duration-300 group-hover:text-[#FDFBD4]">

              {item.title}

            </p>

          </motion.div>

        );
      })}

    </div>

  </div>

</section>
    <section className="section-padding bg-gradient-to-b from-[#FDFBD4] via-white to-[#F3E4D2]">

  <div className="container-custom">

    <SectionTitle
      badge="Our Services"
      title="Professional Biomedical Services"
      description="Comprehensive biomedical solutions for hospitals, laboratories and healthcare institutions."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      {services.slice(0, 3).map((service, index) => (

        <ServiceCard
          key={index}
          icon={icons[index]}
          title={service.title}
          description={service.desc}
        />

      ))}

    </div>

    <div className="mt-14 text-center">

      <Link href={makeLink("/services")}>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-[#C05800] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#713600] hover:shadow-xl">

          View All Services

          <ArrowRight size={18} />

        </button>

      </Link>

    </div>

  </div>

</section>
   <section className="section-padding bg-[#FDFBD4]">

  <div className="container-custom">

    <SectionTitle
      badge="Featured Products"
      title="Popular Biomedical Equipment"
      description="Explore our most demanded biomedical and diagnostic equipment."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {products.slice(0, 3).map((product) => (

        <div
          key={product.slug || product.id || product.title}
          className="group overflow-hidden rounded-[30px] border border-[#E8D3BC] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >

          <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#FDFBD4] via-white to-[#F3E4D2] p-8">

            <img
              src={
                product.images?.[0] ||
                product.image
              }
              alt={product.title}
              className="max-h-52 object-contain transition duration-300 group-hover:scale-105"
            />

          </div>

          <div className="p-7">

            <span className="inline-block rounded-full border border-[#C05800]/20 bg-[#F3E4D2] px-3 py-1 text-xs font-semibold text-[#713600]">

              {product.category}

            </span>

            <h3 className="mt-4 text-2xl font-bold text-[#38240D]">

              {product.title}

            </h3>

            <p className="mt-3 line-clamp-3 leading-7 text-[#5B4634]">

              {product.description ||
                product.desc}

            </p>

            <Link
              href={makeLink(`/items/${product.slug}`)}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-[#C05800] transition hover:text-[#713600]"
            >

              View Product

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      ))}

    </div>

    <div className="mt-14 text-center">

      <Link href={makeLink("/items")}>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-[#C05800] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#713600] hover:shadow-xl">

          View All Products

          <ArrowRight size={18} />

        </button>

      </Link>

    </div>

  </div>

</section>
    </>
  );
}