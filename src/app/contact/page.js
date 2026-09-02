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
import PageBanner from "@/components/PageBanner";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [contactInfo, setContactInfo] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const pathname = usePathname();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

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
      : null;

  /* ==========================================================
     FORM CHANGE
  ========================================================== */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ==========================================================
     FORM SUBMIT
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!form.name.trim()) {
      return toast.error("Please enter your name");
    }

    if (!emailRegex.test(form.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error("Please enter a valid mobile number");
    }

    if (!form.message.trim()) {
      return toast.error("Please add your requirement");
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "tublerin",
          "contactQueries"
        ),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      toast.success(
        "Your enquiry was submitted successfully"
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
        "We could not submit the enquiry"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================================
     LOAD DISTRICT
  ========================================================== */

  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "tublerin",
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

  /* ==========================================================
     LOAD CONTACT
  ========================================================== */

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "tublerin",
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

  /* ==========================================================
     CONTACT DATA
  ========================================================== */

  const getContactField = (info, type) => {
    if (!Array.isArray(info)) return null;
    return info.find((x) => {
      const label = (x.label || "").toLowerCase().trim();
      if (type === "phone") {
        return label === "phone" || label === "phone number" || label.includes("phone") || label.includes("mobile") || label.includes("contact");
      }
      if (type === "email") {
        return label === "email" || label === "email address" || label.includes("email") || label.includes("mail");
      }
      if (type === "address") {
        return label === "address" || label === "office address" || label.includes("address");
      }
      if (type === "hours") {
        return label === "working hours" || label === "hours" || label.includes("work") || label.includes("hour") || label.includes("time");
      }
      return false;
    })?.value;
  };

  const phone =
    getContactField(contactInfo, "phone") ||
    "+91 9983123469\n+91 9983333489";

  const email =
    getContactField(contactInfo, "email") ||
    "rajbiosis@yahoo.in";

  const address =
    getContactField(contactInfo, "address") ||
    "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021";

  const hours =
    getContactField(contactInfo, "hours") ||
    "Mon - Sat (10AM - 6PM)";

  const dynamicAddress = districtData
    ? `${districtData.district}, ${districtData.state}, India`
    : address;

  const phoneNumbers = phone
    ? String(phone)
      .split(/[\n,;/|]+/)
      .map((num) => num.trim())
      .filter(Boolean)
    : [];

  const mapAddress =
    encodeURIComponent(dynamicAddress);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="section-padding bg-[#FDFBD4]">
        <div className="container-custom">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <div className="mb-8 h-12 w-64 animate-pulse rounded bg-[#FDFBD4]" />

              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="mb-6 h-28 animate-pulse rounded-3xl bg-[#FDFBD4]"
                />
              ))}

            </div>

            <div className="rounded-3xl border border-[#E8D3BC] bg-white p-10">

              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="mb-5 h-14 animate-pulse rounded-2xl bg-[#FDFBD4]"
                />
              ))}

            </div>

          </div>

        </div>
      </section>
    );
  }

  return (
    <>
      {/* ======================================================
          PAGE BANNER
      ====================================================== */}

      <PageBanner
        title="Start a Product Enquiry"
        subtitle="Tell us about any laboratory, diagnostic, testing or healthcare product you need. Tubler.in is a broad supply platform, not a tubler-only product site."
      />

      {/* ======================================================
          CONTACT SECTION
      ====================================================== */}

      <section className="section-padding bg-[#FDFBD4]">

        <div className="container-custom grid gap-14 lg:grid-cols-2">

          {/* ==================================================
              LEFT INFO
          ================================================== */}

          <div>

            {/* Badge */}

            <span className="mb-5 inline-block rounded-full border border-[#E8D3BC] bg-white px-5 py-2 font-semibold text-[#C05800]">
              Requirement & Contact Details
            </span>


            {/* Heading */}

            <h2 className="section-title text-[#713600]">
              Let’s Start a Conversation
            </h2>


            {/* Description */}

            <p className="section-subtitle text-[#5B4634]">
              Reach out to us for healthcare
              consultation, biomedical products,
              and advanced diagnostic support.
            </p>


            {/* ==================================================
                CONTACT CARDS
            ================================================== */}

            <div className="mt-10 space-y-6">

              {/* Phone */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#E8D3BC] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800] hover:shadow-[0_15px_40px_rgba(192,88,0,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C05800] text-white shadow-md shadow-[#C05800]/20">
                  <Phone size={24} />
                </div>

                <div>

                  <h4 className="text-lg font-semibold text-[#5B4634]">
                    Phone Number
                  </h4>

                  <div className="mt-2 space-y-1">

                    {phoneNumbers.map(
                      (num, i) => (
                        <p
                          key={i}
                          className="text-[#C05800]"
                        >
                          <a
                            href={`tel:${num}`}
                            className="transition hover:text-[#713600]"
                          >
                            {num}
                          </a>
                        </p>
                      )
                    )}

                  </div>

                </div>

              </div>


              {/* Email */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#E8D3BC] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800] hover:shadow-[0_15px_40px_rgba(192,88,0,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C05800] text-white shadow-md shadow-[#C05800]/20">
                  <Mail size={24} />
                </div>

                <div>

                  <h4 className="text-lg font-semibold text-[#5B4634]">
                    Email Address
                  </h4>

                  <p className="mt-2 break-all text-[#C05800]">
                    {email}
                  </p>

                </div>

              </div>


              {/* Address */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#E8D3BC] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800] hover:shadow-[0_15px_40px_rgba(192,88,0,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C05800] text-white shadow-md shadow-[#C05800]/20">
                  <MapPin size={24} />
                </div>

                <div>

                  <h4 className="text-lg font-semibold text-[#5B4634]">
                    Office Address
                  </h4>

                  <p className="mt-2 leading-7 text-[#5B4634]">
                    {dynamicAddress}
                  </p>

                </div>

              </div>


              {/* Working Hours */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#E8D3BC] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800] hover:shadow-[0_15px_40px_rgba(192,88,0,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C05800] text-white shadow-md shadow-[#C05800]/20">
                  <Clock3 size={24} />
                </div>

                <div>

                  <h4 className="text-lg font-semibold text-[#5B4634]">
                    Working Hours
                  </h4>

                  <p className="mt-2 text-[#C05800]">
                    {hours}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              RIGHT FORM
          ================================================== */}

          <div className="rounded-[40px] border border-[#E8D3BC] bg-white p-8 shadow-[0_20px_60px_rgba(192,88,0,0.10)] lg:p-10">

            <h3 className="text-3xl font-bold text-[#5B4634]">
              Send Us Message
            </h3>

            <p className="mt-3 text-[#5B4634]">
              Fill out the form and our team
              will contact you soon.
            </p>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Name */}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#5B4634] outline-none placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/15"
              />


              {/* Email */}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#5B4634] outline-none placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/15"
              />


              {/* Phone */}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value.replace(
                        /\D/g,
                        ""
                      ),
                  })
                }
                className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#5B4634] outline-none placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/15"
              />


              {/* Subject */}

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#5B4634] outline-none placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/15"
              />


              {/* Message */}

              <textarea
                rows={5}
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className="w-full resize-none rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#5B4634] outline-none placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/15"
              />


              {/* Submit */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#C05800] py-4 font-semibold !text-white shadow-lg shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#713600] hover:shadow-xl hover:shadow-[#C05800]/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {submitting
                  ? "Submitting..."
                  : "Send Message"}
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* ======================================================
          GOOGLE MAP
      ====================================================== */}

      <section className="bg-white pb-24">

        <div className="container-custom">

          <div className="overflow-hidden rounded-[40px] border border-[#E8D3BC] shadow-lg shadow-[#C05800]/10">

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
    </>
  );
}