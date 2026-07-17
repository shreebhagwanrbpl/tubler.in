import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({
  icon,
  title,
  description,
  loading = false,
}) {

  if (loading) {
    return (
    <div className="animate-pulse rounded-[30px] border border-[#E8D3BC] bg-white p-8 shadow-lg">

  <div className="mb-6 h-16 w-16 rounded-[22px] bg-[#F3E4D2]"></div>

  <div className="mb-4 h-8 rounded bg-[#EAD9C4]"></div>

  <div className="space-y-3">

    <div className="h-4 rounded bg-[#F3E4D2]"></div>

    <div className="h-4 w-11/12 rounded bg-[#F3E4D2]"></div>

    <div className="h-4 w-8/12 rounded bg-[#F3E4D2]"></div>

  </div>

</div>
    );
  }

  return (
   <div className="group rounded-[30px] border border-[#E8D3BC] bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-[#C05800]/40 hover:shadow-2xl hover:shadow-[#C05800]/10">

  {/* Icon */}
  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#F3E4D2] to-[#FDFBD4] text-[#C05800] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C05800] group-hover:text-white">

    {icon}

  </div>

  {/* Title */}
  <h3 className="mb-4 text-2xl font-semibold text-[#38240D] transition-colors duration-300 group-hover:text-[#713600]">

    {title}

  </h3>

  {/* Description */}
  <p className="leading-7 text-[#5B4634]">

    {description}

  </p>

</div>
  );
}