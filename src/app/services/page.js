"use client";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
} from "lucide-react";


import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
// import CTASection from "@/components/CTASection";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "tublerin",
            "pages",
            "services"
          )
        );

        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  return (
    <>

      {/* Services Grid */}
      <section className="section-padding bg-gradient-to-b from-white via-[#FFF9EF] to-[#FDFBD4]">

        <div className="container-custom">

          <SectionTitle
            badge="What We Ongoing Assistance"
            title="Laboratory & Healthcare Supply Ongoing Assistance"
            description="We assist with a wide range of laboratory, diagnostic, testing and healthcare product requirements, with support focused on clear specifications and practical procurement."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[30px] border border-[#E8D3BC] bg-white p-10 shadow-lg shadow-[#C05800]/10"
                >

                  {/* Icon */}

                  <div className="mb-8 h-20 w-20 rounded-3xl bg-[#F3E4D2]"></div>

                  {/* Title */}

                  <div className="mb-6 h-8 w-2/3 rounded bg-[#EAD9C4]"></div>

                  {/* Description */}

                  <div className="space-y-3">

                    <div className="h-4 rounded bg-[#F3E4D2]"></div>

                    <div className="h-4 w-11/12 rounded bg-[#F3E4D2]"></div>

                    <div className="h-4 w-8/12 rounded bg-[#F3E4D2]"></div>

                  </div>

                </div>
              ))
              : services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={icons[index]}
                  title={service.title}
                  description={service.desc}
                />
              ))}

          </div>

        </div>

      </section>

      {/* Working Process */}
      <section className="section-padding bg-gradient-to-b from-[#FDFBD4] via-white to-[#FFF9EF]">

        <div className="container-custom">

          <SectionTitle
            badge="Our Working Method"
            title="A Clear Route From Requirement to Enquiry"
            description="We keep the sourcing journey straightforward: understand the requirement, identify suitable options and coordinate the next procurement step."
            center
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {[
              {
                step: "01",
                title: "Requirement Review",
                desc:
                  "We clarify the product category, intended application, quantity and any important specifications.",
              },
              {
                step: "02",
                title: "Option Coordination",
                desc:
                  "We coordinate relevant product information and help organize the enquiry around the customer's stated need.",
              },
              {
                step: "03",
                title: "Ongoing Assistance",
                desc:
                  "We remain available for follow-up questions, product details and routine procurement communication.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[30px] border border-[#E8D3BC] bg-white p-8 shadow-lg shadow-[#C05800]/10 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800]/40 hover:shadow-2xl hover:shadow-[#C05800]/15"
              >

                {/* Step Number */}

                <span className="text-6xl font-black text-[#E4C5A2] transition duration-300 group-hover:text-[#C05800]/30">

                  {item.step}

                </span>

                {/* Title */}

                <h3 className="mt-5 text-2xl font-bold text-[#38240D]">

                  {item.title}

                </h3>

                {/* Description */}

                <p className="mt-4 leading-7 text-[#5B4634]">

                  {item.desc}

                </p>

                {/* Bottom Line */}

                <div className="mt-8 h-1 w-16 rounded-full bg-[#C05800] transition-all duration-300 group-hover:w-24 group-hover:bg-[#713600]"></div>

              </div>
            ))}

          </div>

        </div>

      </section>
      {/* ======================================================
          SERVICE ADVANTAGES
      ====================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex rounded-full border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-2 text-sm font-bold text-[#C05800]">
              Where We Add Value
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#5B4634] sm:text-4xl lg:text-5xl">
              Complete Biomedical Ongoing Assistance For Healthcare
            </h2>

            <p className="mt-5 leading-8 text-[#6B5A4A]">
              From identifying a laboratory consumable to discussing a diagnostic product,
              we provide practical assistance that keeps the
              requirement clear and the procurement conversation
              focused on the product and application.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* CARD 1 */}

            <div className="group rounded-[28px] border border-[#E8D3BC] bg-[#FDFBD4] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-white">

                <Microscope size={25} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Laboratory Solutions
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">
                Reliable equipment and solutions for pathology,
                diagnostic and research laboratories.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="group rounded-[28px] border border-[#E8D3BC] bg-[#FDFBD4] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-white">

                <Stethoscope size={25} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Healthcare Equipment
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">
                Biomedical equipment solutions supporting hospitals,
                clinics and healthcare institutions.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="group rounded-[28px] border border-[#E8D3BC] bg-[#FDFBD4] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-white">

                <Wrench size={25} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Technical Assistance
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">
                Professional assistance for installation,
                configuration, maintenance and equipment support.
              </p>

            </div>


            {/* CARD 4 */}

            <div className="group rounded-[28px] border border-[#E8D3BC] bg-[#FDFBD4] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-white">

                <ShieldCheck size={25} />

              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Trusted Ongoing Assistance
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">
                Responsive assistance and after-sales support focused
                on long-term reliability.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          SERVICE COMMITMENT
      ====================================================== */}

      <section className="section-padding bg-[#FDFBD4]">

        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <span className="inline-flex rounded-full border border-[#E8D3BC] bg-white px-5 py-2 text-sm font-bold text-[#C05800]">
                Our Commitment
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight text-[#5B4634] sm:text-4xl">
                More Than Equipment, We Deliver Complete Solutions
              </h2>

              <p className="mt-5 leading-8 text-[#6B5A4A]">
                Every healthcare facility has different requirements.
                Our service approach focuses on understanding those
                needs and providing solutions that are practical,
                dependable and easy to manage.
              </p>

              <p className="mt-4 leading-8 text-[#6B5A4A]">
                We aim to build long-term relationships with hospitals,
                laboratories and healthcare professionals through
                dependable products and professional service.
              </p>

            </div>


            {/* RIGHT */}

            <div className="rounded-[32px] border border-[#E8D3BC] bg-white p-7 shadow-xl shadow-[#C05800]/10 sm:p-9">

              <h3 className="text-2xl font-black text-[#5B4634]">
                What You Can Expect
              </h3>

              <div className="mt-7 space-y-5">

                {/* POINT 1 */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05800] text-white">
                    ✓
                  </div>

                  <div>

                    <h4 className="font-bold text-[#5B4634]">
                      Professional Requirement Review
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#6B5A4A]">
                      Understand your requirements and help identify
                      suitable biomedical solutions.
                    </p>

                  </div>

                </div>


                {/* POINT 2 */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05800] text-white">
                    ✓
                  </div>

                  <div>

                    <h4 className="font-bold text-[#5B4634]">
                      Reliable Option Coordination
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#6B5A4A]">
                      Ongoing Assistance with equipment supply, installation and
                      configuration according to requirements.
                    </p>

                  </div>

                </div>


                {/* POINT 3 */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05800] text-white">
                    ✓
                  </div>

                  <div>

                    <h4 className="font-bold text-[#5B4634]">
                      Continued Assistance
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#6B5A4A]">
                      Ongoing technical guidance and support whenever
                      assistance is required.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          SERVICE CTA
      ====================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <div className="rounded-[36px] border border-[#E8D3BC] bg-[#FDFBD4] px-7 py-10 text-center sm:px-12 sm:py-14 lg:px-20">

            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#C05800]">
              Need Biomedical Ongoing Assistance?
            </span>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black text-[#5B4634] sm:text-4xl">
              Let’s Find The Right Solution For Your Healthcare Facility
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6B5A4A]">
              Tell us about your laboratory, hospital or diagnostic
              requirements and our team can help you explore suitable
              biomedical equipment and service solutions.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <a
                href="/contact"
                className="rounded-xl bg-[#C05800] px-7 py-3.5 font-semibold !text-white shadow-lg shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#713600] hover:shadow-xl"
              >
                Contact Us
              </a>

              <a
                href="/items"
                className="rounded-xl border border-[#C05800] bg-white px-7 py-3.5 font-semibold text-[#C05800] transition-all duration-300 hover:-translate-y-1 hover:bg-[#FDFBD4]"
              >
                Explore Products
              </a>

            </div>

          </div>

        </div>

      </section>
      {/* CTA */}
      {/* <CTASection /> */}
    </>
  );
}