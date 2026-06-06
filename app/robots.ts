import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/blog", "/blog/", "/face-analyzer", "/height-calculator", "/rizz-coach"],
                disallow: ["/dashboard/", "/api/", "/portal"],
            },
        ],
        sitemap: "https://moggg.pro/sitemap.xml",
        host: "https://moggg.pro",
    };
}
