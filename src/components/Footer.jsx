"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "districts",
            district
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [district]);

  const phone =
    contactInfo.find(
      (x) => x.label === "Phone Number"
    )?.value || "";

  const email =
    contactInfo.find(
      (x) => x.label === "Email Address"
    )?.value || "";

  const address =
    contactInfo.find(
      (x) => x.label === "Office Address"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };
  if (loading) {
    return (
   <footer className="border-t border-[#E8D3BC] bg-[#FDFBD4]">

  <div className="container-custom py-16">

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

      {[...Array(4)].map((_, i) => (
        <div key={i}>

          <div className="mb-6 h-8 w-40 animate-pulse rounded bg-[#EAD9C4]" />

          {[...Array(5)].map((_, j) => (
            <div
              key={j}
              className="mb-4 h-5 animate-pulse rounded bg-[#F3E4D2]"
            />
          ))}

        </div>
      ))}

    </div>

    <div className="mt-12 border-t border-[#E8D3BC] pt-6">

      <div className="h-5 w-72 animate-pulse rounded bg-[#EAD9C4]" />

    </div>

  </div>

</footer>
    );
  }
  return (
   <footer className="border-t border-[#E8D3BC] bg-gradient-to-b from-white via-[#FFF9EF] to-[#FDFBD4]">

  <div className="container-custom py-16">

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

      {/* Company */}

      <div>

        <h2 className="text-2xl font-bold text-[#C05800]">
          Central
          <span className="text-[#38240D]">
            {" "}Biomedicals
          </span>
        </h2>

        <p className="mt-5 leading-7 text-[#5B4634]">
          Delivering trusted diagnostic
          and biomedical solutions with
          innovation, quality, and
          precision healthcare support.
        </p>

      </div>

      {/* Quick Links */}

      <div>

        <h3 className="mb-5 text-lg font-semibold text-[#38240D]">
          Quick Links
        </h3>

        <div className="flex flex-col gap-3">

          {[
            { name: "Home", link: "/" },
            { name: "About", link: "/about" },
            { name: "Services", link: "/services" },
            { name: "Products", link: "/items" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (

            <Link
              key={item.name}
              href={makeLink(item.link)}
              className="text-[#5B4634] transition-all duration-300 hover:translate-x-1 hover:text-[#C05800]"
            >
              {item.name}
            </Link>

          ))}

        </div>

      </div>

      {/* Services */}

      <div>

        <h3 className="mb-5 text-lg font-semibold text-[#38240D]">
          Services
        </h3>

        <div className="space-y-3 text-[#5B4634]">

          <p className="transition hover:text-[#C05800]">
            Diagnostic Equipment
          </p>

          <p className="transition hover:text-[#C05800]">
            Laboratory Solutions
          </p>

          <p className="transition hover:text-[#C05800]">
            Biomedical Instruments
          </p>

          <p className="transition hover:text-[#C05800]">
            Maintenance Support
          </p>

        </div>

      </div>

      {/* Contact */}

      <div>

        <h3 className="mb-5 text-lg font-semibold text-[#38240D]">
          Contact Info
        </h3>

        <div className="space-y-5 text-[#5B4634]">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E4D2]">

              <MapPin
                size={18}
                className="text-[#C05800]"
              />

            </div>

            <p className="leading-6">
              {dynamicAddress}
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E4D2]">

              <Phone
                size={18}
                className="text-[#C05800]"
              />

            </div>

            <p>{phone}</p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E4D2]">

              <Mail
                size={18}
                className="text-[#C05800]"
              />

            </div>

            <p>{email}</p>

          </div>

        </div>

      </div>

    </div>

    {/* Bottom */}

    <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#E8D3BC] pt-8 text-sm text-[#6B5A4A] md:flex-row">

      <p>
        © 2026 Central Biomedicals. All rights reserved.
      </p>

      <p>
        Designed with <span className="text-[#C05800]">❤</span> for modern diagnostics.
      </p>

    </div>

  </div>

</footer>
  );
}