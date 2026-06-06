import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Navbar from "@/components/ui/navbar";
import PublicFooter from "@/components/ui/public-footer";
import LoginCTAButton from "@/components/ui/login-cta-button";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: post.title,
        description: post.description,
        keywords: post.tags,
        alternates: { canonical: `https://moggg.pro/blog/${post.slug}` },
        openGraph: {
            title: `${post.title} | Moggg`,
            description: post.description,
            url: `https://moggg.pro/blog/${post.slug}`,
            type: "article",
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    return (
        <div className="w-screen min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero */}
            <section className="w-full relative overflow-hidden flex flex-col justify-center items-center px-4 pt-40 pb-20 text-center rounded-b-3xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 w-full h-full bg-[url('/hero3.jpg')] bg-cover bg-center" />
                <div className="relative z-20 max-w-4xl space-y-5">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-2">
                        ← Back to Blog
                    </Link>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {post.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/75">
                        {post.title}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{post.description}</p>
                    {post.date && <p className="text-xs text-muted-foreground">{post.date}</p>}
                </div>
            </section>

            {/* Article */}
            <article className="max-w-3xl mx-auto px-6 py-16">
                <div className="border-b border-border mb-10" />

                {/* Markdown content */}
                <div className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-white
                    prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-4
                    prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white
                    prose-strong:text-white prose-strong:font-semibold
                    prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:pl-6
                    prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:pl-6
                    prose-li:my-1
                    prose-hr:border-border prose-hr:my-8
                    prose-blockquote:border-l-4 prose-blockquote:border-white/20 prose-blockquote:pl-4 prose-blockquote:text-muted-foreground prose-blockquote:italic
                    prose-code:text-white prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-[#171719] prose-pre:border prose-pre:border-border prose-pre:rounded-3xl prose-pre:p-4
                    prose-img:rounded-3xl
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw as any]}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Inline CTA */}
                <div className="mt-16 rounded-3xl border border-border bg-[#171719] p-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">Track Your Looksmax Progress with AI</h2>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                        Get your PSL score, facial analysis, and personalized improvement roadmap on Moggg.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <LoginCTAButton label="Analyze My Face →" size="lg" className="px-8 py-4 rounded-full" />
                        <LoginCTAButton label="Get Started Free" size="lg" className="px-8 py-4 rounded-full" variant="outline" />
                    </div>
                </div>
            </article>

            {/* CTA */}
            <section className="py-32 px-4 bg-gradient-to-b from-accent/5 to-background">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6">Ready to Transform Yourself?</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of individuals who've upgraded their lives
                    </p>
                    <LoginCTAButton label="Get Started Free →" size="lg" className="px-8 py-6 text-lg" />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
