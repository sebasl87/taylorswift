import { MetadataRoute } from "next";
import bootlegsData from "@/constants/bootlegs.json";
import { Bootleg, generateBootlegSlug } from "@/types/bootleg";

export default function sitemap(): MetadataRoute.Sitemap {
  const bootlegs = bootlegsData as Bootleg[];

  const bootlegEntries = bootlegs.map((bootleg) => ({
    url: `https://taylorswift.com/bootlegs/${generateBootlegSlug(bootleg)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://taylorswift.com/bootlegs",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...bootlegEntries,
  ];
}
