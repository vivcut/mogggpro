import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import PublicFooter from "@/components/ui/public-footer";
import LoginCTAButton from "@/components/ui/login-cta-button";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
    title: "Looksmaxxing Blog – Tips, Guides & Science",
    description:
        "Learn how to maximize your looks with science-backed guides on facial aesthetics, skincare, jawline training, diet, and more. The Moggg looksmaxxing blog.",
    keywords: ["looksmaxxing blog", "looksmax tips", "how to lookmax", "glow up guide", "facial aesthetics", "mewing", "jawline exercises"],
    alternates: { canonical: "https://moggg.pro/blog" },
    openGraph: {
        title: "Looksmaxxing Blog | Moggg",
        description: "Science-backed guides on how to improve your looks, face, and overall attractiveness.",
        url: "https://moggg.pro/blog",
    },
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="w-screen min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero */}
            <section className="w-full relative overflow-hidden flex flex-col justify-center items-center px-4 pt-40 pb-24 text-center rounded-b-3xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 w-full h-full bg-[url('/hero3.jpg')] bg-cover bg-center" />
                <div className="relative z-20 max-w-3xl space-y-6">
                    <span className="text-xs uppercase tracking-widest text-white/50 block">Knowledge Base</span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/75">
                        Looksmaxxing Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Science-backed guides to help you improve your facial aesthetics, skincare, and overall attractiveness.
                    </p>
                </div>
            </section>

            {/* Posts */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-6">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                                <article className="h-full rounded-3xl border border-border bg-[#171719] p-6 hover:border-white/30 transition-all duration-200">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                                        ))}
                                    </div>
                                    <h2 className="text-xl font-medium text-white mb-2 group-hover:text-white/80 transition-colors">{post.title}</h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs text-muted-foreground">{post.date}</span>
                                        <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Read more →</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="py-32 px-4 bg-gradient-to-b from-accent/5 to-background">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">Ready to Start Your Glow-Up?</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Get your AI face analysis, PSL score, and personalized improvement plan on Moggg.
                    </p>
                    <LoginCTAButton label="Get Started Free →" size="lg" className="px-8 py-6 text-lg" />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
