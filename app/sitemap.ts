import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://moggg.pro";

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/face-analyzer`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/height-calculator`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/rizz-coach`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes];
}
