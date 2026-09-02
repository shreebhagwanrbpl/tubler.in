import Image from "next/image";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Tubler.in"
        subtitle="A broad online destination for laboratory, diagnostic and healthcare supplies, built around practical product access and responsive sourcing support."
      />

      {/* About Section */}
      <section className="section-padding bg-gradient-to-b from-white via-[#FFF9EF] to-[#FDFBD4]">

        <div className="container-custom grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Image */}
          <div className="relative">

            <div className="flex h-[600px] items-center justify-center overflow-hidden rounded-[40px] border border-[#E8D3BC] bg-gradient-to-br from-[#FDFBD4] via-white to-[#F3E4D2] p-10 shadow-xl shadow-[#C05800]/10">

              <Image
                src="/about.png"
                alt="About"
                width={1200}
                height={900}
                className="max-h-full max-w-full object-contain transition duration-500 hover:scale-105"
              />

            </div>

            {/* Floating Experience Card */}

            <div className="absolute bottom-8 left-8 hidden rounded-[28px] border border-[#E8D3BC] bg-white px-8 py-6 shadow-2xl lg:block">

              <h3 className="text-4xl font-black text-[#C05800]">

                10+

              </h3>

              <p className="mt-2 text-[#6B5A4A]">

                Years of Excellence

              </p>

            </div>

          </div>

          {/* Right Content */}

          <div>

            <SectionTitle
              badge="Who We Are"
              title="A Practical Partner for Diverse Laboratory Requirements"
              description="Tubler.in brings together information and sourcing support for a wide range of laboratory, diagnostic, testing and healthcare products."
            />

            <p className="mt-8 leading-8 text-[#5B4634]">

              At Tubler.in, we support
              laboratories and healthcare teams looking for different categories of
              products and supplies that can support routine operations, testing and
              procurement requirements across clinics, hospitals, laboratories
              and other healthcare settings.

            </p>

            <p className="mt-6 leading-8 text-[#5B4634]">

              Our focus is to make product discovery and procurement communication easier
              by presenting useful product information and
              supporting enquiries across
              multiple product categories rather than limiting the platform to one type of item.

            </p>

            {/* Features */}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">

              <div className="rounded-3xl border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800]/30 hover:shadow-2xl hover:shadow-[#C05800]/10">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E4D2] text-2xl">

                  🏥

                </div>

                <h4 className="text-xl font-bold text-[#38240D]">

                  Broad Product Selection

                </h4>

                <p className="mt-3 leading-7 text-[#5B4634]">

                  Laboratory, diagnostic and healthcare
                  supplies organized for different
                  applications and procurement needs.

                </p>

              </div>

              <div className="rounded-3xl border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800]/30 hover:shadow-2xl hover:shadow-[#C05800]/10">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E4D2] text-2xl">

                  🤝

                </div>

                <h4 className="text-xl font-bold text-[#38240D]">

                  Requirement-Focused Assistance

                </h4>

                <p className="mt-3 leading-7 text-[#5B4634]">

                  Clear communication around product selection,
                  quantities, specifications and
                  routine or larger supply enquiries.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* ======================================================
          OUR APPROACH
      ====================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex rounded-full border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-2 text-sm font-bold text-[#C05800]">
              How We Work
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#5B4634] sm:text-4xl lg:text-5xl">
              Practical Sourcing, Clear Communication
            </h2>

            <p className="mt-5 leading-8 text-[#6B5A4A]">
              We believe a useful supply platform should make it easier to
              identify relevant products, understand basic requirements and
              connect enquiries with the right information and
              next procurement step.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {/* CARD 1 */}

            <div className="group rounded-[30px] border border-[#E8D3BC] bg-[#FDFBD4] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-2xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-xl text-white">
                01
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Start With the Requirement
              </h3>

              <p className="mt-3 leading-7 text-[#6B5A4A]">
                We first look at the product category, intended use,
                quantity and available specifications before
                guiding the enquiry.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="group rounded-[30px] border border-[#E8D3BC] bg-[#FDFBD4] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-2xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-xl text-white">
                02
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Find Suitable Options
              </h3>

              <p className="mt-3 leading-7 text-[#6B5A4A]">
                We help customers explore relevant laboratory, diagnostic
                and healthcare products that fit the
                stated requirement.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="group rounded-[30px] border border-[#E8D3BC] bg-[#FDFBD4] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800] hover:bg-white hover:shadow-2xl hover:shadow-[#C05800]/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C05800] text-xl text-white">
                03
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#5B4634]">
                Stay Available for Follow-Up
              </h3>

              <p className="mt-3 leading-7 text-[#6B5A4A]">
                Questions can continue after the initial enquiry, with
                practical communication around
                availability, specifications and procurement details.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          WHY CHOOSE US
      ====================================================== */}

      <section className="section-padding bg-[#FDFBD4]">

        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <span className="inline-flex rounded-full border border-[#E8D3BC] bg-white px-5 py-2 text-sm font-bold text-[#C05800]">
                Why Choose Tubler.in
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight text-[#5B4634] sm:text-4xl">
                One Platform for Many Laboratory Requirements
              </h2>

              <p className="mt-5 leading-8 text-[#6B5A4A]">
                Our goal is to make a broad range of laboratory and healthcare
                supplies easier to discover while keeping product enquiries
                simple and focused.
              </p>

              <div className="mt-8 space-y-5">

                {/* POINT 1 */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05800] text-sm font-bold text-white">
                    ✓
                  </div>

                  <div>

                    <h4 className="font-bold text-[#5B4634]">
                      Category-Wide Availability
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#6B5A4A]">
                      The platform is designed for different types of
                      laboratory, diagnostic, testing and healthcare
                      requirements.
                    </p>

                  </div>

                </div>


                {/* POINT 2 */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05800] text-sm font-bold text-white">
                    ✓
                  </div>

                  <div>

                    <h4 className="font-bold text-[#5B4634]">
                      Professional Guidance
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#6B5A4A]">
                      Clear product information and assistance
                      to help customers make informed decisions.
                    </p>

                  </div>

                </div>


                {/* POINT 3 */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C05800] text-sm font-bold text-white">
                    ✓
                  </div>

                  <div>

                    <h4 className="font-bold text-[#5B4634]">
                      Customer-Centric Support
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-[#6B5A4A]">
                      Responsive assistance designed to build
                      lasting professional relationships.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT */}

            <div className="relative">

              <div className="rounded-[36px] border border-[#E8D3BC] bg-white p-8 shadow-xl shadow-[#C05800]/10 sm:p-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C05800] text-2xl text-white">
                  +
                </div>

                <h3 className="mt-7 text-2xl font-black text-[#5B4634] sm:text-3xl">
                  Healthcare That Moves Forward
                </h3>

                <p className="mt-4 leading-8 text-[#6B5A4A]">
                  From diagnostic laboratories to hospitals and
                  healthcare institutions, we aim to contribute
                  to better healthcare through dependable
                  biomedical technology and professional support.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-[#FDFBD4] p-5">

                    <p className="text-2xl font-black text-[#C05800]">
                      10+
                    </p>

                    <p className="mt-1 text-sm text-[#6B5A4A]">
                      Years Experience
                    </p>

                  </div>


                  <div className="rounded-2xl bg-[#FDFBD4] p-5">

                    <p className="text-2xl font-black text-[#C05800]">
                      3500+
                    </p>

                    <p className="mt-1 text-sm text-[#6B5A4A]">
                      Products
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          OUR COMMITMENT
      ====================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <div className="rounded-[36px] border border-[#E8D3BC] bg-[#FDFBD4] px-7 py-10 text-center sm:px-12 sm:py-14 lg:px-20">

            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#C05800]">
              Our Commitment
            </span>

            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black text-[#5B4634] sm:text-4xl lg:text-5xl">
              Supporting Better Healthcare Through Reliable Technology
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-[#6B5A4A]">
              We remain committed to delivering dependable biomedical
              solutions, maintaining strong customer relationships and
              continuously improving the way healthcare professionals
              access technology and support.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <span className="rounded-full border border-[#E8D3BC] bg-white px-5 py-2 text-sm font-semibold text-[#5B4634]">
                Quality
              </span>

              <span className="rounded-full border border-[#E8D3BC] bg-white px-5 py-2 text-sm font-semibold text-[#5B4634]">
                Precision
              </span>

              <span className="rounded-full border border-[#E8D3BC] bg-white px-5 py-2 text-sm font-semibold text-[#5B4634]">
                Innovation
              </span>

              <span className="rounded-full border border-[#E8D3BC] bg-white px-5 py-2 text-sm font-semibold text-[#5B4634]">
                Support
              </span>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}