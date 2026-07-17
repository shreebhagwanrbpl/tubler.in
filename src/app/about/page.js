import Image from "next/image";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Central Biomedicals"
        subtitle="Delivering trusted diagnostic and biomedical technologies with innovation, quality, and healthcare precision."
      />

      {/* About Section */}
    <section className="section-padding bg-gradient-to-b from-white via-[#FFF9EF] to-[#FDFBD4]">

  <div className="container-custom grid lg:grid-cols-2 gap-20 items-center">

    {/* Left Image */}
    <div className="relative">

      <div className="flex h-[600px] items-center justify-center overflow-hidden rounded-[40px] border border-[#E8D3BC] bg-gradient-to-br from-[#FDFBD4] via-white to-[#F3E4D2] p-10 shadow-xl shadow-[#C05800]/10">

        <Image
          src={DDS}
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
        title="Trusted Partner in Biomedical & Diagnostics"
        description="Delivering innovative biomedical equipment and laboratory solutions with quality, precision and trusted healthcare support."
      />

      <p className="mt-8 leading-8 text-[#5B4634]">

        At Central Biomedicals, we specialize in providing
        premium biomedical and diagnostic equipment that
        enhances laboratory performance, healthcare accuracy
        and clinical efficiency across hospitals, laboratories
        and healthcare institutions.

      </p>

      <p className="mt-6 leading-8 text-[#5B4634]">

        Our mission is to empower healthcare professionals
        through advanced technology, reliable products and
        dedicated after-sales support while maintaining the
        highest standards of quality and innovation.

      </p>

      {/* Features */}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">

        <div className="rounded-3xl border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800]/30 hover:shadow-2xl hover:shadow-[#C05800]/10">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E4D2] text-2xl">

            🏥

          </div>

          <h4 className="text-xl font-bold text-[#38240D]">

            Premium Equipment

          </h4>

          <p className="mt-3 leading-7 text-[#5B4634]">

            High-quality laboratory and diagnostic
            instruments designed for maximum
            precision and long-term reliability.

          </p>

        </div>

        <div className="rounded-3xl border border-[#E8D3BC] bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800]/30 hover:shadow-2xl hover:shadow-[#C05800]/10">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E4D2] text-2xl">

            🤝

          </div>

          <h4 className="text-xl font-bold text-[#38240D]">

            Expert Support

          </h4>

          <p className="mt-3 leading-7 text-[#5B4634]">

            Professional consultation, installation,
            maintenance and dedicated customer
            support across India.

          </p>

        </div>

      </div>

    </div>

  </div>

</section>
    </>
  );
}