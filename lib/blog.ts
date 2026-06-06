import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    content: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; content: string } {
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) return { meta: {}, content: raw };

    const meta: Record<string, string> = {};
    fmMatch[1].split("\n").forEach((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) return;
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        meta[key] = value;
    });

    return { meta, content: fmMatch[2].trim() };
}

export function getAllPosts(): BlogPost[] {
    if (!fs.existsSync(CONTENT_DIR)) return [];

    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".txt"));

    return files
        .map((filename) => {
            const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
            const { meta, content } = parseFrontmatter(raw);
            const slug = meta.slug || filename.replace(/\.txt$/, "");
            return {
                slug,
                title: meta.title || slug,
                description: meta.description || "",
                date: meta.date || "",
                tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()) : [],
                content,
            };
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
    const posts = getAllPosts();
    return posts.find((p) => p.slug === slug) ?? null;
}
