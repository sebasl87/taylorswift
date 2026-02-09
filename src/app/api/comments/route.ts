import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAX_PER_HOUR = 10;
const WINDOW_SECONDS = 60 * 60;

// Helper functions
function pageVersionKey(pageType: string, pageId: string) {
  return `comments:v:${pageType}:${pageId}`;
}

function pageCacheKey(pageType: string, pageId: string, version: number, limit: number, offset: number) {
  return `comments:cache:${pageType}:${pageId}:v${version}:l${limit}:o${offset}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pt = searchParams.get("pageType");
  const pi = searchParams.get("pageId");
  const l = searchParams.get("limit");
  const o = searchParams.get("offset");

  const pageType = (pt || "").trim();
  const pageId = (pi || "").trim();

  if (!pageType || !pageId) {
    return NextResponse.json({ error: "Missing pageType/pageId" }, { status: 400 });
  }

  const limit = Math.min(Number(l || "20"), 50);
  const offset = Math.max(Number(o || "0"), 0);

  const vKey = pageVersionKey(pageType, pageId);
  const version = (await kv.get<number>(vKey)) ?? 0;

  const cKey = pageCacheKey(pageType, pageId, version, limit, offset);
  const cached = await kv.get<{ items: Record<string, unknown>[] }>(cKey);

  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "x-comments-cache": "HIT",
        "x-comments-version": String(version),
      },
    });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id,page_type,page_id,name,content,created_at")
    .eq("page_type", pageType)
    .eq("page_id", pageId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Cache the result
  const result = { items: data || [] };
  await kv.set(cKey, result, { ex: 60 }); // Cache for 1 minute

  return NextResponse.json(result, {
    headers: {
      "x-comments-cache": "MISS",
      "x-comments-version": String(version),
    },
  });
}
