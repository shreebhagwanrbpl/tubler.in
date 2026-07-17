export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
}) {
  return (
<div
  className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}
>

  {/* Badge */}
  {badge && (
    <div className="mb-5 inline-flex items-center rounded-full border border-[#C05800]/20 bg-[#F3E4D2] px-5 py-2 text-sm font-semibold text-[#713600] shadow-sm">
      {badge}
    </div>
  )}

  {/* Title */}
  <h2 className="section-title text-[#38240D]">
    {title}
  </h2>

  {/* Description */}
  <p className="section-subtitle mt-4 text-[#5B4634]">
    {description}
  </p>

</div>
  );
}