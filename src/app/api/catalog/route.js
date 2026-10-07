import { NextResponse } from "next/server";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

const headers = {
  "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
};

export async function GET() {
  try {
    const products = await fetchFullCatalog();
    return NextResponse.json({ products }, { headers });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Catalog request failed" },
      { status: 500, headers }
    );
  }
}
