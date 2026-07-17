"use client";

import { motion } from "framer-motion";

export default function PageBanner({
  title,
  subtitle,
}) {
  return (
<section className="relative overflow-hidden bg-gradient-to-br from-[#FDFBD4] via-white to-[#F3E4D2] py-28 lg:py-36">

  {/* Background Blur */}
  <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#C05800]/15 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#713600]/10 blur-[140px]" />

  {/* Grid Pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(#C0580015_1px,transparent_1px),linear-gradient(90deg,#C0580015_1px,transparent_1px)] bg-[size:40px_40px]" />

  <div className="container-custom relative z-10">

    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className="mx-auto max-w-4xl text-center"
    >

      {/* Badge */}

      <span className="inline-flex rounded-full border border-[#C05800]/20 bg-[#F3E4D2] px-5 py-2 text-sm font-semibold text-[#713600]">

        Welcome to Our Company

      </span>

      {/* Title */}

      <h1 className="mt-8 text-5xl font-black leading-tight text-[#38240D] lg:text-7xl">

        {title}

      </h1>

      {/* Subtitle */}

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5B4634]">

        {subtitle}

      </p>

    </motion.div>

  </div>

</section>
  );
}