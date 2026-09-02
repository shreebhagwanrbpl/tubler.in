"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

const ProductCard = React.memo(function ProductCard({
    product,
    district,
}) {
    const pathname = usePathname();

    const pathParts =
        pathname?.split("/").filter(Boolean) || [];

    const staticRoutes = [
        "about",
        "services",
        "items",
        "contact",
    ];

    const currentDistrict =
        district ||
        (pathParts.length > 0 &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "");

    const productSlug =
        product.slug ||
        product.productSlug ||
        makeSlug(product.title);

    return (
        <div
            id={product.slug || productSlug}
            className="group rounded-[30px] border border-[#E8D3BC] bg-white p-5 shadow-lg shadow-[#E8D3BC]/40 transition-all duration-300 hover:-translate-y-1 hover:border-[#C05800] hover:shadow-2xl hover:shadow-[#E8D3BC]"
        >

            <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[240px_1fr_180px] lg:gap-8">

                {/* IMAGE */}

                <div className="relative h-[180px] overflow-hidden rounded-2xl border border-[#E8D3BC] bg-gradient-to-br from-[#FDFBD4] via-white to-[#FDFBD4] sm:h-[220px] lg:rounded-3xl">

                    {/* Small Accent */}

                    <div className="absolute left-3 top-3 z-10 h-2.5 w-2.5 rounded-full bg-[#C05800]" />

                    <img
                        src={
                            product.images?.[0] ||
                            product.image ||
                            "/placeholder.svg"
                        }
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="relative z-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src =
                                "/placeholder.svg";
                        }}
                    />

                </div>


                {/* CONTENT */}

                <div>

                    {/* Product Title */}

                    <h3 className="text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-[#C05800] sm:text-2xl">
                        {product.title}
                    </h3>


                    {/* Description */}

                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                        {product.description ||
                            product.desc ||
                            "Premium biomedical equipment designed for laboratories, hospitals and diagnostic centres."}
                    </p>


                    {/* PRODUCT INFORMATION */}

                    <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">

                        {/* BRAND */}

                        <div className="rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] p-4 transition-all duration-300 hover:border-[#C05800] hover:bg-white">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C05800]">
                                Brand
                            </p>

                            <p className="mt-1 break-words font-semibold text-slate-800">
                                {product.brand || "N/A"}
                            </p>

                        </div>


                        {/* MODEL */}

                        <div className="rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] p-4 transition-all duration-300 hover:border-[#C05800] hover:bg-white">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C05800]">
                                Model
                            </p>

                            <p className="mt-1 break-words font-semibold text-slate-800">
                                {product.model || "N/A"}
                            </p>

                        </div>


                        {/* INSTRUMENT */}

                        <div className="rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] p-4 transition-all duration-300 hover:border-[#C05800] hover:bg-white">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C05800]">
                                Instrument
                            </p>

                            <p className="mt-1 break-words font-semibold text-slate-800">
                                {product.instrument || "N/A"}
                            </p>

                        </div>


                        {/* CATEGORY */}

                        <div className="rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] p-4 transition-all duration-300 hover:border-[#C05800] hover:bg-white">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C05800]">
                                Category
                            </p>

                            <p className="mt-1 break-words font-semibold text-slate-800">
                                {product.category || "N/A"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* GET QUOTE */}

                <div className="flex justify-center lg:justify-end">

                    <Link
                        href={
                            currentDistrict
                                ? `/${currentDistrict}/items/${productSlug}`
                                : `/items/${productSlug}`
                        }
                        className="group/btn inline-flex w-full min-w-[145px] items-center justify-center rounded-xl bg-[#C05800] px-7 py-3.5 font-semibold !text-white shadow-md shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#713600] hover:!text-white hover:shadow-xl hover:shadow-[#C05800]/30 active:translate-y-0 active:scale-[0.98] lg:w-auto"
                    >

                        <span className="!text-white">
                            Get Quote
                        </span>

                        <span className="ml-2 !text-white transition-transform duration-300 group-hover/btn:translate-x-1">
                            →
                        </span>

                    </Link>

                </div>

            </div>

        </div>
    );
});

export default ProductCard;