import { getAllNews } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const news = await getAllNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}
