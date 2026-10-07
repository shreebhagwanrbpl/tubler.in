"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import {
    doc,
    getDoc,
    addDoc,
    collection,
} from "@/lib/client-api";

import { db } from "@/lib/client-api";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import { Download } from "lucide-react";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

export default function ProductDetails({ slug }) {
    const [product, setProduct] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);

    const shareRef = useRef();
    const brochureRef = useRef();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [brochureImage, setBrochureImage] = useState("");

    const [contactData, setContactData] = useState({
        phone: "+91 9983123469\n+91 9983333489",
        email: "rajbiosis@yahoo.in",
        address:
            "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021",
    });

    const pathname = usePathname();

    const pathParts =
        pathname?.split("/").filter(Boolean) || [];

    const city =
        pathParts.length > 1 &&
            ![
                "about",
                "services",
                "items",
                "contact",
            ].includes(pathParts[0])
            ? pathParts[0]
            : "India";

    const cityName =
        city.charAt(0).toUpperCase() +
        city.slice(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const allProducts =
                    await fetchFullCatalog();

                const found = allProducts.find(
                    (p) => p.slug === slug
                );

                setProduct(found || null);

                if (found) {
                    if (found.images?.length > 0) {
                        setSelectedImage(
                            found.images[0]
                        );
                    } else {
                        setSelectedImage(
                            found.image || ""
                        );
                    }

                    setSelectedMedia("image");
                }
            } catch (error) {
                console.error(
                    "Error loading product catalog:",
                    error
                );
            }
        };

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
                    const info =
                        snap.data().contactInfo || [];

                    const getContactField = (infoList, type) => {
                        if (!Array.isArray(infoList)) return null;
                        return infoList.find((x) => {
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
                            return false;
                        })?.value;
                    };

                    const phoneVal = getContactField(info, "phone") || "";
                    const emailVal = getContactField(info, "email") || "";
                    const addressVal = getContactField(info, "address") || "";

                    setContactData({
                        phone:
                            phoneVal ||
                            "+91 9983123469\n+91 9983333489",
                        email:
                            emailVal ||
                            "rajbiosis@yahoo.in",
                        address:
                            addressVal ||
                            "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021",
                    });
                }
            } catch (err) {
                console.error(
                    "Error loading contact details:",
                    err
                );
            }
        };

        loadProduct();
        loadContact();
    }, [slug]);

    const handleDownloadBrochure = async () => {
        if (downloading || !product) {
            return;
        }

        setDownloading(true);

        const toastId = toast.loading(
            "Generating brochure PDF..."
        );

        try {
            const html2canvas =
                (
                    await import(
                        "html2canvas"
                    )
                ).default;

            const { jsPDF } =
                await import("jspdf");

            let base64Img = "";

            const imageUrl =
                selectedImage ||
                product.image;

            if (imageUrl) {
                try {
                    const proxyUrl =
                        `/_next/image?url=${encodeURIComponent(
                            imageUrl
                        )}&w=640&q=75`;

                    const res =
                        await fetch(proxyUrl);

                    if (res.ok) {
                        const blob =
                            await res.blob();

                        base64Img =
                            await new Promise(
                                (resolve) => {
                                    const reader =
                                        new FileReader();

                                    reader.onloadend =
                                        () =>
                                            resolve(
                                                reader.result
                                            );

                                    reader.readAsDataURL(
                                        blob
                                    );
                                }
                            );
                    }
                } catch (imgErr) {
                    console.error(
                        "Error proxying image for brochure:",
                        imgErr
                    );
                }
            }

            setBrochureImage(
                base64Img ||
                imageUrl ||
                "/placeholder.svg"
            );

            const input =
                brochureRef.current ||
                document.getElementById(
                    "brochure-template"
                );

            if (!input) {
                toast.error(
                    "Brochure template load nahi hua. Please try again."
                );
                setDownloading(false);
                return;
            }

            input.style.display = "block";
            input.style.position = "absolute";
            input.style.left = "-9999px";
            input.style.top = "0px";

            await new Promise((resolve) =>
                setTimeout(resolve, 200)
            );

            const canvas =
                await html2canvas(
                    input,
                    {
                        useCORS: true,
                        allowTaint: true,
                        scale: 2,
                        logging: false,
                        backgroundColor:
                            "#FFFFFF",
                    }
                );

            input.style.display = "none";

            const imgData =
                canvas.toDataURL(
                    "image/png"
                );

            const pdf =
                new jsPDF({
                    orientation:
                        "portrait",
                    unit: "mm",
                    format: "a4",
                });

            const imgWidth = 210;
            const pageHeight = 297;

            const imgHeight =
                (canvas.height *
                    imgWidth) /
                canvas.width;

            const height =
                Math.min(
                    imgHeight,
                    pageHeight
                );

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                imgWidth,
                height,
                undefined,
                "FAST"
            );

            pdf.save(
                `Raj_Biosis_${product.title.replace(
                    /\s+/g,
                    "_"
                )}_Brochure.pdf`
            );

            toast.success(
                "Brochure downloaded successfully!",
                {
                    id: toastId,
                }
            );
        } catch (error) {
            console.error(
                "Error generating PDF brochure:",
                error
            );

            toast.error(
                "Failed to generate PDF. Please try again.",
                {
                    id: toastId,
                }
            );
        } finally {
            setDownloading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex =
            /^[6-9]\d{9}$/;

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

        try {
            setSubmitting(true);

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "tublerin",
                    "productQueries"
                ),
                {
                    ...form,
                    productName:
                        product.title,
                    productSlug:
                        product.slug,
                    brand:
                        product.brand || "",
                    model:
                        product.model || "",
                    createdAt:
                        new Date(),
                }
            );

            toast.success(
                "Your enquiry has been submitted successfully."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);

            toast.error(
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const productSchema = product
        ? {
            "@context":
                "https://schema.org",
            "@type": "Product",
            name:
                product.title,
            image:
                product.image
                    ? [product.image]
                    : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            brand: {
                "@type": "Brand",
                name:
                    product.brand ||
                    "Raj Biosis",
            },
        }
        : null;

    const faqSchema = product
        ? {
            "@context":
                "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type":
                        "Question",
                    name:
                        `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type":
                            "Answer",
                        text:
                            `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type":
                        "Question",
                    name:
                        "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type":
                            "Answer",
                        text:
                            "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(
            window.location.href
        );

        toast.success(
            "Link Copied"
        );

        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText =
            `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(
                shareText
            )}`,
            "_blank"
        );
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(
            window.location.href
        );

        toast.success(
            "Instagram direct sharing available nahi hai. Link copied."
        );
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title:
                    product.title,
                text:
                    product.desc,
                url:
                    window.location.href,
            });
        } else {
            setShowShare(
                !showShare
            );
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(
                    e.target
                )
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener(
            "mousedown",
            close
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                close
            );
    }, []);

    if (!product) {
        return (
            <section className="bg-[#FDFBD4] py-10 md:py-20">
                <div className="container-custom">

                    <div className="grid gap-12 lg:grid-cols-2">

                        <div className="h-[420px] animate-pulse rounded-[36px] bg-[#FDFBD4] md:h-[520px]" />

                        <div>

                            <div className="mb-8 h-12 w-3/4 animate-pulse rounded-xl bg-[#FDFBD4]" />

                            {[...Array(8)].map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="mb-4 h-6 animate-pulse rounded-lg bg-[#FDFBD4]"
                                    />
                                )
                            )}

                        </div>

                    </div>

                    <div className="mt-16 grid gap-8 lg:grid-cols-[600px_1fr]">

                        <div className="rounded-[24px] border border-[#E8D3BC] bg-white p-5 shadow-sm md:rounded-[32px] md:p-8">

                            <div className="mb-6 h-10 w-48 animate-pulse rounded-lg bg-[#FDFBD4]" />

                            {[...Array(4)].map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="mb-4 h-14 animate-pulse rounded-2xl bg-[#FDFBD4]"
                                    />
                                )
                            )}

                        </div>

                        <div className="rounded-[24px] border border-[#E8D3BC] bg-white p-5 shadow-sm md:rounded-[32px] md:p-8">

                            <div className="mb-6 h-10 w-60 animate-pulse rounded-lg bg-[#FDFBD4]" />

                            {[...Array(6)].map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="mb-4 h-5 animate-pulse rounded bg-[#FDFBD4]"
                                    />
                                )
                            )}

                        </div>

                    </div>

                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#FDFBD4] py-10 md:py-20">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            productSchema
                        ),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            faqSchema
                        ),
                }}
            />

            <div className="container-custom">

                {/* BREADCRUMB */}

                <div className="mb-6 text-sm text-[#C05800]">

                    <span className="hover:text-[#713600]">
                        Home
                    </span>

                    {" / "}

                    <span className="hover:text-[#713600]">
                        Products
                    </span>

                    {" / "}

                    <span className="font-medium text-[#713600]">
                        {product.title}
                    </span>

                </div>


                {/* TOP SECTION */}

                <div className="grid gap-12 lg:grid-cols-2">

                    {/* PRODUCT IMAGE */}

                    <div>

                        <div className="relative h-[340px] overflow-hidden rounded-[24px] border border-[#E8D3BC] bg-gradient-to-br from-[#FDFBD4] via-white to-[#FDFBD4] shadow-[0_25px_80px_rgba(192,88,0,0.12)] sm:h-[420px] md:h-[500px] lg:h-[580px] md:rounded-[36px]">

                            {selectedMedia ===
                                "video" &&
                                product.video ? (
                                <video
                                    controls
                                    autoPlay
                                    className="h-full w-full object-contain p-6"
                                >
                                    <source
                                        src={
                                            product.video
                                        }
                                        type="video/mp4"
                                    />
                                </video>
                            ) : (
                                <>
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 animate-pulse bg-[#FDFBD4]" />
                                    )}

                                    <Image
                                        src={
                                            selectedImage ||
                                            product.image
                                        }
                                        alt={
                                            product.title
                                        }
                                        fill
                                        priority
                                        onLoad={() =>
                                            setImageLoaded(
                                                true
                                            )
                                        }
                                        className={`object-contain p-4 transition duration-500 ${imageLoaded
                                            ? "opacity-100"
                                            : "opacity-0"
                                            }`}
                                    />
                                </>
                            )}

                        </div>


                        {/* THUMBNAILS */}

                        <div className="mt-5 flex flex-wrap gap-3">

                            {(product.images?.length
                                ? product.images
                                : [product.image]
                            ).map(
                                (img, index) => (
                                    <button
                                        key={
                                            index
                                        }
                                        onClick={() => {
                                            setSelectedImage(
                                                img
                                            );

                                            setSelectedMedia(
                                                "image"
                                            );

                                            setImageLoaded(
                                                false
                                            );
                                        }}
                                        className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-300 ${selectedMedia ===
                                            "image" &&
                                            selectedImage ===
                                            img
                                            ? "border-[#C05800] shadow-[0_5px_15px_rgba(192,88,0,0.25)]"
                                            : "border-[#E8D3BC] hover:border-[#C05800]"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt=""
                                            width={80}
                                            height={80}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                )
                            )}

                            {product.video && (
                                <button
                                    onClick={() =>
                                        setSelectedMedia(
                                            "video"
                                        )
                                    }
                                    className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 ${selectedMedia ===
                                        "video"
                                        ? "border-[#C05800] bg-[#FDFBD4] text-[#C05800]"
                                        : "border-[#E8D3BC] text-[#C05800] hover:border-[#C05800] hover:bg-[#FDFBD4]"
                                        }`}
                                >
                                    <FaPlay size={20} />

                                    <span className="mt-1 text-xs">
                                        Video
                                    </span>
                                </button>
                            )}

                            {product.pdf && (
                                <a
                                    href={
                                        product.pdf
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border border-[#E8D3BC] text-[#C05800] transition-all hover:border-[#C05800] hover:bg-[#FDFBD4]"
                                >
                                    <span className="text-xl">
                                        📄
                                    </span>

                                    <span className="text-xs text-[#C05800]">
                                        PDF
                                    </span>
                                </a>
                            )}

                        </div>

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div>

                        <div className="relative flex items-start justify-between gap-4">

                            <h1 className="text-2xl font-bold leading-tight text-[#5B4634] sm:text-3xl md:text-4xl lg:text-5xl">
                                {product.title}
                            </h1>

                            {/* SHARE */}

                            <div
                                ref={
                                    shareRef
                                }
                                className="relative"
                            >

                                <button
                                    onClick={
                                        handleNativeShare
                                    }
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8D3BC] bg-white text-[#C05800] shadow-md transition-all hover:scale-105 hover:border-[#C05800] hover:bg-[#FDFBD4]"
                                >
                                    <FaShareAlt
                                        size={18}
                                    />
                                </button>

                                {showShare && (
                                    <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-[#E8D3BC] bg-white p-2 shadow-[0_20px_50px_rgba(192,88,0,0.15)]">

                                        <button
                                            onClick={
                                                handleCopy
                                            }
                                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[#5B4634] transition hover:bg-[#FDFBD4] hover:text-[#C05800]"
                                        >
                                            <FaLink />
                                            Copy Link
                                        </button>

                                        <button
                                            onClick={
                                                handleWhatsapp
                                            }
                                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[#5B4634] transition hover:bg-[#FDFBD4] hover:text-[#C05800]"
                                        >
                                            <FaWhatsapp className="text-green-600" />
                                            WhatsApp
                                        </button>

                                        <button
                                            onClick={
                                                handleFacebook
                                            }
                                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[#5B4634] transition hover:bg-[#FDFBD4] hover:text-[#C05800]"
                                        >
                                            <FaFacebook className="text-[#C05800]" />
                                            Facebook
                                        </button>

                                        <button
                                            onClick={
                                                handleInstagram
                                            }
                                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[#5B4634] transition hover:bg-[#FDFBD4] hover:text-[#C05800]"
                                        >
                                            <FaInstagram className="text-[#C05800]" />
                                            Instagram
                                        </button>

                                    </div>
                                )}

                            </div>

                        </div>


                        {/* PRODUCT INFO */}

                        <div className="mt-6 space-y-4 rounded-[24px] border border-[#E8D3BC] bg-white p-5 shadow-[0_20px_60px_rgba(192,88,0,0.10)] sm:p-6 md:mt-8 md:rounded-[30px] md:p-8">

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Brand:
                                </b>{" "}
                                {product.brand ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Model:
                                </b>{" "}
                                {product.model ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Instrument:
                                </b>{" "}
                                {product.instrument ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Capacity:
                                </b>{" "}
                                {product.capacity ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Throughput:
                                </b>{" "}
                                {product.throughput ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Usage:
                                </b>{" "}
                                {product.usage ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Automation:
                                </b>{" "}
                                {product.automation ||
                                    "N/A"}
                            </p>

                            <p className="text-[#5B4634]">
                                <b className="text-[#713600]">
                                    Availability:
                                </b>{" "}
                                {product.availability ||
                                    "N/A"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* DESCRIPTION + FORM */}

                <div className="mt-16">

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] md:gap-8">

                        {/* QUOTE FORM */}

                        <div className="h-fit rounded-[24px] border border-[#E8D3BC] bg-white p-5 shadow-[0_20px_60px_rgba(192,88,0,0.10)] md:rounded-[32px] md:p-8 lg:sticky lg:top-24">

                            <h2 className="mb-2 text-2xl font-bold text-[#5B4634] md:text-3xl">
                                Request A Quote
                            </h2>

                            <p className="mb-8 text-[#5B4634]">
                                Product:

                                <span className="ml-2 font-semibold text-[#C05800]">
                                    {product.title}
                                </span>
                            </p>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="space-y-5"
                            >

                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={
                                        form.name
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name:
                                                e.target
                                                    .value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] px-4 py-3 text-[#5B4634] outline-none transition placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/20 md:rounded-2xl md:px-5 md:py-4"
                                />

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={
                                        form.email
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email:
                                                e.target
                                                    .value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-[#E8D3BC] bg-[#FDFBD4] px-4 py-3 text-[#5B4634] outline-none transition placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/20 md:rounded-2xl md:px-5 md:py-4"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    value={
                                        form.phone
                                    }
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
                                    className="w-full rounded-2xl border border-[#E8D3BC] bg-[#FDFBD4] px-5 py-4 text-[#5B4634] outline-none transition placeholder:text-[#A4775A] focus:border-[#C05800] focus:ring-2 focus:ring-[#C05800]/20"
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="w-full rounded-2xl bg-[#C05800] py-4 font-semibold !text-white shadow-lg shadow-[#C05800]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#713600] hover:shadow-xl hover:shadow-[#C05800]/25 disabled:opacity-70"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Get Quote"}
                                </button>

                            </form>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="rounded-[24px] border border-[#E8D3BC] bg-white p-5 shadow-[0_20px_60px_rgba(192,88,0,0.10)] sm:p-6 md:rounded-[32px] md:p-10">

                            <h3 className="mb-4 text-2xl font-bold text-[#5B4634] md:mb-6 md:text-3xl">
                                Product Description
                            </h3>

                            <p className="text-base leading-7 text-[#5B4634] md:text-lg md:leading-9">
                                {product.desc ||
                                    product.description ||
                                    "No description available."}
                            </p>




                            {/* SEO CONTENT */}

                            <div className="mt-12">

                                <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                    Why Choose Raj Biosis in{" "}
                                    {cityName}?
                                </h3>

                                <p className="leading-8 text-[#5B4634]">
                                    Raj Biosis is a trusted supplier and
                                    distributor of{" "}
                                    {product.title} in{" "}
                                    {cityName}. We provide high-quality
                                    biomedical and laboratory equipment
                                    for hospitals, pathology laboratories,
                                    diagnostic centres and healthcare
                                    facilities.
                                </p>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        Features of{" "}
                                        {product.title}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        {product.title} offers reliable
                                        performance, accurate results,
                                        easy operation, long service
                                        life and efficient workflow for
                                        laboratories and hospitals.
                                    </p>

                                </div>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        Applications of{" "}
                                        {product.title}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        Widely used in hospitals,
                                        pathology labs, diagnostic
                                        centres, blood banks, research
                                        institutes and healthcare
                                        facilities.
                                    </p>

                                </div>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        {product.title} Supplier in{" "}
                                        {cityName}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        Raj Biosis supplies{" "}
                                        {product.title} in{" "}
                                        {cityName} with technical
                                        support, installation assistance
                                        and customer service for
                                        hospitals and laboratories.
                                    </p>

                                </div>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        {product.title} Dealer in{" "}
                                        {cityName}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        Raj Biosis is a trusted dealer
                                        of {product.title} in{" "}
                                        {cityName}. We supply biomedical
                                        equipment, laboratory instruments,
                                        diagnostic analyzers and healthcare
                                        devices to hospitals, pathology
                                        labs and research centres.
                                    </p>

                                </div>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        {product.title} Distributor in{" "}
                                        {cityName}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        Looking for a reliable distributor
                                        of {product.title} in{" "}
                                        {cityName}? We provide installation
                                        support, product guidance,
                                        maintenance assistance and fast
                                        delivery.
                                    </p>

                                </div>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        Buy {product.title} in{" "}
                                        {cityName}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        Buy high quality{" "}
                                        {product.title} in{" "}
                                        {cityName} at competitive prices.
                                        Contact Raj Biosis for the latest
                                        quotation and product availability.
                                    </p>

                                </div>

                                <div className="mt-8">

                                    <h3 className="mb-4 text-2xl font-bold text-[#5B4634]">
                                        {product.title} Price in{" "}
                                        {cityName}
                                    </h3>

                                    <p className="leading-8 text-[#5B4634]">
                                        The price of{" "}
                                        {product.title} depends on brand,
                                        model, specifications and features.
                                        Contact our team for the latest
                                        pricing, availability and delivery
                                        details.
                                    </p>

                                </div>

                            </div>


                            {/* FAQ */}

                            <div className="mt-12">

                                <h3 className="mb-6 text-2xl font-bold text-[#5B4634]">
                                    Frequently Asked Questions
                                </h3>

                                <div className="space-y-8">

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            What is{" "}
                                            {product.title} used for in{" "}
                                            {cityName}?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            {product.title} is commonly
                                            used in hospitals, pathology
                                            laboratories and diagnostic
                                            centres.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            What is the price of{" "}
                                            {product.title} in{" "}
                                            {cityName}?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            Pricing depends on
                                            specifications, brand and
                                            model. Contact us for a quote.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            Are you an authorized supplier
                                            of {product.title}?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            We supply genuine biomedical
                                            and laboratory equipment from
                                            trusted brands.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            Can hospitals in{" "}
                                            {cityName} order this product?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            Yes, hospitals, pathology
                                            laboratories, diagnostic
                                            centres and healthcare
                                            facilities can order this
                                            product.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            Do you provide installation
                                            support?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            Yes, installation and technical
                                            support are available depending
                                            on the product.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            Can I request a quotation?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            Yes, you can submit the enquiry
                                            form on this page to receive
                                            pricing and product information.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            Do you provide warranty?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            Warranty depends on the
                                            manufacturer and product model.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            Do you deliver across India?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            Yes, we supply products across
                                            India with safe packaging and
                                            logistics support.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#C05800]">
                                            How can I contact Raj Biosis?
                                        </h4>

                                        <p className="mt-2 text-[#5B4634]">
                                            You can fill out the enquiry
                                            form or contact our team
                                            directly for product details
                                            and quotations.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* HIDDEN BROCHURE TEMPLATE */}

            <div
                id="brochure-template"
                ref={brochureRef}
                style={{
                    display: "none",
                    width: "800px",
                    padding: "40px",
                    fontFamily:
                        "system-ui, -apple-system, sans-serif",
                    color: "#5B4634",
                    background: "#FFFFFF",
                    boxSizing: "border-box",
                }}
            >

                {/* Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        borderBottom:
                            "3px solid #C05800",
                        paddingBottom:
                            "20px",
                        marginBottom:
                            "30px",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "15px",
                        }}
                    >

                        <img
                            src="/logo.png"
                            style={{
                                height:
                                    "65px",
                                width:
                                    "auto",
                                objectFit:
                                    "contain",
                            }}
                        />

                        <div>

                            <h1
                                style={{
                                    margin: "0",
                                    fontSize:
                                        "28px",
                                    color:
                                        "#C05800",
                                    fontWeight:
                                        "800",
                                    letterSpacing:
                                        "-0.5px",
                                }}
                            >
                                Raj Biosis
                            </h1>

                            <p
                                style={{
                                    margin:
                                        "2px 0 0 0",
                                    fontSize:
                                        "12px",
                                    color:
                                        "#713600",
                                    fontWeight:
                                        "600",
                                    textTransform:
                                        "uppercase",
                                    letterSpacing:
                                        "1px",
                                }}
                            >
                                Trusted Biomedical Systems
                            </p>

                        </div>

                    </div>


                    <div
                        style={{
                            textAlign:
                                "right",
                            fontSize:
                                "12px",
                            lineHeight:
                                "1.6",
                            color:
                                "#5B4634",
                        }}
                    >

                        <p
                            style={{
                                margin:
                                    "0",
                                fontWeight:
                                    "700",
                                color:
                                    "#C05800",
                                fontSize:
                                    "14px",
                            }}
                        >
                            www.tubler.in
                        </p>

                        <p style={{ margin: "0" }}>
                            Email:{" "}
                            {
                                contactData.email
                            }
                        </p>

                        <div style={{ margin: "0" }}>

                            {String(contactData.phone || "")
                                .split(
                                    /[\n,;/|]+/
                                )
                                .map(
                                    (
                                        num,
                                        i
                                    ) => (
                                        <span
                                            key={
                                                i
                                            }
                                            style={{
                                                display:
                                                    "block",
                                            }}
                                        >
                                            Mob:{" "}
                                            {num.trim()}
                                        </span>
                                    )
                                )}

                        </div>

                    </div>

                </div>


                {/* PRODUCT TITLE */}

                <h2
                    style={{
                        fontSize:
                            "26px",
                        color:
                            "#713600",
                        margin:
                            "0 0 25px 0",
                        textAlign:
                            "center",
                        fontWeight:
                            "800",
                        textTransform:
                            "uppercase",
                    }}
                >
                    {product.title}
                </h2>


                {/* MAIN GRID */}

                <div
                    style={{
                        display:
                            "flex",
                        gap:
                            "30px",
                        marginBottom:
                            "35px",
                    }}
                >

                    <div
                        style={{
                            flex:
                                "1.2",
                            border:
                                "1px solid #E8D3BC",
                            borderRadius:
                                "16px",
                            padding:
                                "20px",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            height:
                                "320px",
                            backgroundColor:
                                "#FDFBD4",
                        }}
                    >

                        <img
                            src={
                                brochureImage ||
                                "/placeholder.jpg"
                            }
                            style={{
                                maxWidth:
                                    "100%",
                                maxHeight:
                                    "100%",
                                objectFit:
                                    "contain",
                            }}
                        />

                    </div>


                    <div
                        style={{
                            flex:
                                "1",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            justifyContent:
                                "space-between",
                        }}
                    >

                        <div
                            style={{
                                backgroundColor:
                                    "#FDFBD4",
                                border:
                                    "1px solid #E8D3BC",
                                borderRadius:
                                    "16px",
                                padding:
                                    "20px",
                                height:
                                    "100%",
                                boxSizing:
                                    "border-box",
                            }}
                        >

                            <h3
                                style={{
                                    margin:
                                        "0 0 15px 0",
                                    color:
                                        "#C05800",
                                    fontSize:
                                        "18px",
                                    fontWeight:
                                        "700",
                                    borderBottom:
                                        "1px solid #E8D3BC",
                                    paddingBottom:
                                        "8px",
                                }}
                            >
                                Specifications
                            </h3>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap:
                                        "10px",
                                }}
                            >

                                {[
                                    [
                                        "Brand",
                                        product.brand ||
                                        "Raj Biosis",
                                    ],
                                    [
                                        "Model",
                                        product.model ||
                                        "N/A",
                                    ],
                                    [
                                        "Instrument",
                                        product.instrument,
                                    ],
                                    [
                                        "Category",
                                        product.category,
                                    ],
                                    [
                                        "Subcategory",
                                        product.subCategory,
                                    ],
                                    [
                                        "Capacity",
                                        product.capacity,
                                    ],
                                    [
                                        "Throughput",
                                        product.throughput,
                                    ],
                                    [
                                        "Usage",
                                        product.usage,
                                    ],
                                    [
                                        "Automation",
                                        product.automation,
                                    ],
                                    [
                                        "Availability",
                                        product.availability,
                                    ],
                                ]
                                    .filter(
                                        ([, value]) =>
                                            value
                                    )
                                    .map(
                                        (
                                            [
                                                label,
                                                value,
                                            ],
                                            index
                                        ) => (
                                            <p
                                                key={
                                                    index
                                                }
                                                style={{
                                                    margin:
                                                        "0",
                                                    fontSize:
                                                        "14px",
                                                    color:
                                                        "#5B4634",
                                                }}
                                            >
                                                <strong
                                                    style={{
                                                        color:
                                                            "#713600",
                                                    }}
                                                >
                                                    {
                                                        label
                                                    }:
                                                </strong>{" "}
                                                {
                                                    value
                                                }
                                            </p>
                                        )
                                    )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* PRODUCT OVERVIEW */}

                <div style={{ marginBottom: "35px" }}>

                    <h3
                        style={{
                            color:
                                "#C05800",
                            fontSize:
                                "18px",
                            fontWeight:
                                "700",
                            borderLeft:
                                "4px solid #C05800",
                            paddingLeft:
                                "10px",
                            margin:
                                "0 0 12px 0",
                        }}
                    >
                        Product Overview
                    </h3>

                    <p
                        style={{
                            fontSize:
                                "14px",
                            lineHeight:
                                "1.6",
                            color:
                                "#5B4634",
                            margin:
                                "0",
                            textAlign:
                                "justify",
                        }}
                    >
                        {product.description ||
                            product.desc ||
                            "Premium biomedical equipment designed for laboratories, hospitals, and diagnostic centers."}
                    </p>

                </div>


                {/* FOOTER */}

                <div
                    style={{
                        marginTop:
                            "auto",
                        borderTop:
                            "1px solid #E8D3BC",
                        paddingTop:
                            "20px",
                        textAlign:
                            "center",
                        fontSize:
                            "11px",
                        color:
                            "#713600",
                        lineHeight:
                            "1.5",
                    }}
                >

                    <p
                        style={{
                            margin:
                                "0",
                            fontWeight:
                                "600",
                        }}
                    >
                        Office Address:{" "}
                        {
                            contactData.address
                        }
                    </p>

                    <p
                        style={{
                            margin:
                                "5px 0 0 0",
                        }}
                    >
                        © 2026 Raj Biosis. All rights reserved. Premium diagnostics and biomedical solutions.
                    </p>

                </div>

            </div>


            {/* DOWNLOAD BROCHURE */}

            <button
                onClick={
                    handleDownloadBrochure
                }
                disabled={
                    downloading
                }
                title="Download Brochure"
                className="fixed bottom-24 right-8 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-[#C05800] px-6 font-semibold !text-white shadow-lg shadow-[#C05800]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#713600] hover:shadow-xl hover:shadow-[#C05800]/30 active:scale-95 disabled:opacity-75"
            >

                {downloading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <Download
                        size={20}
                    />
                )}

                <span className="!text-white">
                    Download Brochure
                </span>

            </button>

        </section>
    );
}