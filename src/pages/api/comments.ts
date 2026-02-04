import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from "@vercel/kv";
import { createClient } from "@supabase/supabase-js";

// export const runtime = "nodejs"; // Not needed in Pages Router, it's default

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAX_PER_HOUR = 10;
const WINDOW_SECONDS = 60 * 60;

const GET_CACHE_TTL_SECONDS = 60;

function getIP(req: NextApiRequest) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return (Array.isArray(xf) ? xf[0] : xf).split(",")[0].trim();
  const remoteAddress = req.socket.remoteAddress;
  return remoteAddress || "unknown";
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "");
}

function stripUrls(input: string) {
  return input.replace(/https?:\/\/\S+/gi, "").replace(/\bwww\.\S+/gi, "");
}

function normalizeText(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeContent(raw: string) {
  const noHtml = stripHtml(raw);
  const noUrls = stripUrls(noHtml);
  const normalized = normalizeText(noUrls);
  return normalized.slice(0, 2000);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function rateLimitOrThrow(ip: string) {
  const key = `rl:comments:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, WINDOW_SECONDS);
  if (count > MAX_PER_HOUR) throw new Error("RATE_LIMIT");
}

function pageVersionKey(pageType: string, pageId: string) {
  return `comments:v:${pageType}:${pageId}`;
}
function pageCacheKey(pageType: string, pageId: string, version: number, limit: number, offset: number) {
  return `comments:cache:${pageType}:${pageId}:v${version}:l${limit}:o${offset}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { pageType: pt, pageId: pi, limit: l, offset: o } = req.query;
    const pageType = (Array.isArray(pt) ? pt[0] : pt || "").trim();
    const pageId = (Array.isArray(pi) ? pi[0] : pi || "").trim();

    if (!pageType || !pageId) {
      return res.status(400).json({ error: "Missing pageType/pageId" });
    }

    const limit = Math.min(Number(Array.isArray(l) ? l[0] : l || "20"), 50);
    const offset = Math.max(Number(Array.isArray(o) ? o[0] : o || "0"), 0);

    const vKey = pageVersionKey(pageType, pageId);
    const version = (await kv.get<number>(vKey)) ?? 0;

    const cKey = pageCacheKey(pageType, pageId, version, limit, offset);
    const cached = await kv.get<{ items: any[] }>(cKey);

    if (cached) {
      res.setHeader("x-comments-cache", "HIT");
      res.setHeader("x-comments-version", String(version));
      return res.status(200).json(cached);
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
      return res.status(500).json({ error: error.message });
    }

    const payload = { items: data ?? [] };

    await kv.set(cKey, payload, { ex: GET_CACHE_TTL_SECONDS });

    res.setHeader("x-comments-cache", "MISS");
    res.setHeader("x-comments-version", String(version));
    res.setHeader("x-comments-cache-ttl", String(GET_CACHE_TTL_SECONDS));
    return res.status(200).json(payload);

  } else if (req.method === 'POST') {
    const ip = getIP(req);

    const body = req.body; // Next.js automatically parses JSON body

    const pageType = String(body.pageType || "").trim();
    const pageId = String(body.pageId || "").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const contentRaw = String(body.content || "");
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
      res.setHeader("x-comments-honeypot", "TRIPPED");
      return res.status(200).json({ ok: true });
    }

    if (!pageType || !pageId || !name || !email || !contentRaw) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const content = sanitizeContent(contentRaw);
    if (content.length < 3) {
      return res.status(400).json({ error: "Comment too short" });
    }

    try {
      await rateLimitOrThrow(ip);
    } catch (e: any) {
      if (e?.message === "RATE_LIMIT") {
        res.setHeader("x-rl-limit", String(MAX_PER_HOUR));
        res.setHeader("x-rl-window", String(WINDOW_SECONDS));
        return res.status(429).json({ error: "Too many comments. Try later." });
      }
      return res.status(500).json({ error: "Rate limit error" });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        page_type: pageType,
        page_id: pageId,
        name,
        email,
        content,
        status: "published",
      })
      .select("id,page_type,page_id,name,content,created_at")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const vKey = pageVersionKey(pageType, pageId);
    const newVersion = await kv.incr(vKey);

    res.setHeader("x-comments-cache", "PURGE");
    res.setHeader("x-comments-version", String(newVersion));
    return res.status(201).json({ item: data });

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
