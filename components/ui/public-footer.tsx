import Link from "next/link";

export default function PublicFooter() {
    return (
        <footer className="bg-card border-t border-border py-12 px-4 rounded-t-3xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Moggg</h3>
                    <p className="text-muted-foreground">
                        AI-powered tools to maximize your genetic potential.
                    </p>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Features</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="/face-analyzer" className="hover:text-foreground transition">Facial Analysis</Link></li>
                        <li><Link href="/height-calculator" className="hover:text-foreground transition">Height Coach</Link></li>
                        <li><Link href="/rizz-coach" className="hover:text-foreground transition">Rizz AI</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Content</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="/blog" className="hover:text-foreground transition">Blog</Link></li>
                        <li><Link href="/blog/what-is-looksmaxxing" className="hover:text-foreground transition">What is Looksmaxxing?</Link></li>
                        <li><Link href="/blog/psl-scale-explained" className="hover:text-foreground transition">PSL Scale Explained</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Legal</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="/privacypolicy.pdf" className="hover:text-foreground transition">Privacy</Link></li>
                        <li><Link href="/tos.pdf" className="hover:text-foreground transition">Terms</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-muted-foreground">
                <p>© {new Date().getFullYear()} Moggg. All rights reserved.</p>
            </div>
        </footer>
    );
}
