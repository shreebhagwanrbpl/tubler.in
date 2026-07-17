"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
// import CTASection from "@/components/CTASection";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);
  const [contactInfo, setContactInfo] =
    useState([]);

  const [submitting, setSubmitting] =
    useState(false);
  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const currentDistrict =
    pathParts.length > 0
      ? pathParts[0]
      : null;
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!form.name.trim()) {
      return toast.error(
        "Name is required"
      );
    }

    if (!emailRegex.test(form.email)) {
      return toast.error(
        "Enter valid email"
      );
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error(
        "Enter valid mobile number"
      );
    }

    if (!form.message.trim()) {
      return toast.error(
        "Message is required"
      );
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "centralbiomedicals",
          "contactQueries"
        ),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      toast.success(
        "Message submitted successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "districts",
            currentDistrict
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
  }, [currentDistrict]);
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);



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

  const hours =
    contactInfo.find(
      (x) => x.label === "Working Hours"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const mapAddress = encodeURIComponent(
    dynamicAddress
  );
  if (loading) {
    return (
     <section className="section-padding bg-[#FDFBD4]">

  <div className="container-custom">

    <div className="grid gap-12 lg:grid-cols-2">

      {/* Left Skeleton */}

      <div>

        <div className="mb-8 h-12 w-64 animate-pulse rounded bg-[#EAD9C4]" />

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="mb-6 h-28 animate-pulse rounded-3xl border border-[#E8D3BC] bg-white"
          >
            <div className="flex h-full items-center gap-5 px-6">

              <div className="h-14 w-14 rounded-2xl bg-[#F3E4D2]" />

              <div className="flex-1 space-y-3">

                <div className="h-5 w-40 rounded bg-[#EAD9C4]" />

                <div className="h-4 w-3/4 rounded bg-[#F3E4D2]" />

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Right Form Skeleton */}

      <div className="rounded-3xl border border-[#E8D3BC] bg-white p-10 shadow-lg">

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="mb-5 h-14 animate-pulse rounded-2xl bg-[#F3E4D2]"
          />
        ))}

        <div className="mt-8 h-14 w-44 animate-pulse rounded-2xl bg-[#C05800]/20" />

      </div>

    </div>

  </div>

</section>
    );
  }
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Contact Us"
        subtitle="Get in touch with Central Biomedicals for premium diagnostic and biomedical solutions."
      />

      {/* Contact Section */}
     <section className="section-padding bg-[#FDFBD4]">

  <div className="container-custom grid lg:grid-cols-2 gap-14">

    {/* Left Info */}
    <div>

      {/* Badge */}

      <span className="inline-flex rounded-full border border-[#C05800]/20 bg-[#F3E4D2] px-5 py-2 font-semibold text-[#713600]">

        Contact Information

      </span>

      {/* Heading */}

      <h2 className="mt-6 text-4xl font-black leading-tight text-[#38240D] lg:text-5xl">

        Let's Start a Conversation

      </h2>

      {/* Description */}

      <p className="mt-6 max-w-xl leading-8 text-[#5B4634]">

        Reach out to us for biomedical equipment, laboratory solutions,
        healthcare consultation, installation support, and professional
        diagnostic assistance. Our team is ready to help you choose the
        right solution for your requirements.

      </p>

      {/* Contact Cards */}

      <div className="mt-10 space-y-6">

        {/* Phone */}

        <div className="group flex items-start gap-5 rounded-[30px] border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800]/40 hover:shadow-2xl hover:shadow-[#C05800]/10">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E4D2] to-[#FDFBD4] text-[#C05800] transition-all duration-300 group-hover:bg-[#C05800] group-hover:text-white">

            <Phone size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#38240D]">

              Phone Number

            </h4>

            <p className="mt-2 text-[#5B4634]">

              {phone}

            </p>

          </div>

        </div>

        {/* Email */}

        <div className="group flex items-start gap-5 rounded-[30px] border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800]/40 hover:shadow-2xl hover:shadow-[#C05800]/10">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E4D2] to-[#FDFBD4] text-[#C05800] transition-all duration-300 group-hover:bg-[#C05800] group-hover:text-white">

            <Mail size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#38240D]">

              Email Address

            </h4>

            <p className="mt-2 break-all text-[#5B4634]">

              {email}

            </p>

          </div>

        </div>

        {/* Address */}

        <div className="group flex items-start gap-5 rounded-[30px] border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800]/40 hover:shadow-2xl hover:shadow-[#C05800]/10">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E4D2] to-[#FDFBD4] text-[#C05800] transition-all duration-300 group-hover:bg-[#C05800] group-hover:text-white">

            <MapPin size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#38240D]">

              Office Address

            </h4>

            <p className="mt-2 leading-7 text-[#5B4634]">

              {dynamicAddress}

            </p>

          </div>

        </div>

        {/* Working Hours */}

        <div className="group flex items-start gap-5 rounded-[30px] border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800]/40 hover:shadow-2xl hover:shadow-[#C05800]/10">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E4D2] to-[#FDFBD4] text-[#C05800] transition-all duration-300 group-hover:bg-[#C05800] group-hover:text-white">

            <Clock3 size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#38240D]">

              Working Hours

            </h4>

            <p className="mt-2 text-[#5B4634]">

              {hours}

            </p>

          </div>

        </div>

      </div>

    </div>

    {/* Right Form */}

    <div className="rounded-[40px] border border-[#E8D3BC] bg-white p-8 shadow-xl shadow-[#C05800]/10 lg:p-10">

      {/* Badge */}

      <span className="inline-flex rounded-full border border-[#C05800]/20 bg-[#F3E4D2] px-4 py-2 text-sm font-semibold text-[#713600]">

        Get In Touch

      </span>

      {/* Heading */}

      <h3 className="mt-5 text-3xl font-black text-[#38240D]">

        Send Us a Message

      </h3>

      <p className="mt-3 leading-7 text-[#5B4634]">

        Fill out the form below and our team will contact you shortly with
        the best biomedical solution for your requirements.

      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#38240D] outline-none transition-all duration-300 placeholder:text-[#8A7563] focus:border-[#C05800] focus:bg-white focus:ring-4 focus:ring-[#F3E4D2]"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#38240D] outline-none transition-all duration-300 placeholder:text-[#8A7563] focus:border-[#C05800] focus:bg-white focus:ring-4 focus:ring-[#F3E4D2]"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          maxLength={10}
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
          className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#38240D] outline-none transition-all duration-300 placeholder:text-[#8A7563] focus:border-[#C05800] focus:bg-white focus:ring-4 focus:ring-[#F3E4D2]"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#38240D] outline-none transition-all duration-300 placeholder:text-[#8A7563] focus:border-[#C05800] focus:bg-white focus:ring-4 focus:ring-[#F3E4D2]"
        />

        <textarea
          rows={5}
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full resize-none rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#38240D] outline-none transition-all duration-300 placeholder:text-[#8A7563] focus:border-[#C05800] focus:bg-white focus:ring-4 focus:ring-[#F3E4D2]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-gradient-to-r from-[#C05800] to-[#A64A00] py-4 font-semibold text-white shadow-lg shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-1 hover:from-[#713600] hover:to-[#5A2C00] hover:shadow-xl hover:shadow-[#C05800]/30 disabled:cursor-not-allowed disabled:opacity-70"
        >

          {submitting ? "Submitting..." : "Send Message"}

        </button>

      </form>

    </div>

  </div>

</section>

      {/* Google Map */}
   <section className="bg-[#FDFBD4] pb-24">

  <div className="container-custom">

    <div className="overflow-hidden rounded-[40px] border border-[#E8D3BC] bg-white shadow-xl shadow-[#C05800]/10 transition-all duration-300 hover:shadow-2xl hover:shadow-[#C05800]/15">

      <iframe
        src={`https://maps.google.com/maps?q=${mapAddress}&z=13&output=embed`}
        width="100%"
        height="500"
        loading="lazy"
        className="w-full border-0"
      />

    </div>

  </div>

</section>

      {/* CTA */}
      {/* <CTASection /> */}
    </>
  );
}