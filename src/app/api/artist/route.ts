import { NextRequest, NextResponse } from "next/server";
import { getArtistData } from "@/services/artistService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artistName = searchParams.get("t");
  const lang = searchParams.get("lang") || "es";

  if (!artistName) {
    return NextResponse.json(
      { error: "Missing artist name parameter 't'" },
      { status: 400 }
    );
  }

  if (lang !== "es" && lang !== "en") {
    return NextResponse.json(
      { error: "Invalid lang parameter. Supported: es, en" },
      { status: 400 }
    );
  }

  try {
    const data = await getArtistData(artistName, lang as "es" | "en");
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
