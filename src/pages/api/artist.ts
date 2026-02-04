import type { NextApiRequest, NextApiResponse } from 'next'
import { getArtistData } from "@/services/artistService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { t: artistName, lang = 'es' } = req.query;

  if (!artistName || typeof artistName !== 'string') {
    res.status(400).json({ error: "Missing artist name parameter 't'" });
    return;
  }

  if (lang !== "es" && lang !== "en") {
    res.status(400).json({ error: "Invalid lang parameter. Supported: es, en" });
    return;
  }

  try {
    const data = await getArtistData(artistName, lang as "es" | "en");
    res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
