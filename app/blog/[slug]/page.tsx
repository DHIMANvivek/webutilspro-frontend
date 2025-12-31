'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ChevronLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

interface BlogPost {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    createdAt: string;
    author: string;
    targetTool: string;
}

export default function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/blog/${slug}`);
                if (!response.ok) throw new Error('Post not found');
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                toast.error('Blog post not found');
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchPost();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen gradient-bg pt-32 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen gradient-bg pt-32 text-center">
                <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                <Link href="/blog" className="btn-secondary">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg pt-20 pb-20">
            <article className="container-custom max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-12"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-12 animate-slide-up">
                    <div className="mb-6">
                        <span className="category-badge uppercase tracking-wider text-xs px-4 py-1.5">
                            {post.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-slate-500 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                AI
                            </div>
                            <span className="font-medium text-slate-900">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </header>

                {/* Markdown Content */}
                <div className="prose prose-blue prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-600 animate-fade-in bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/50 p-8 md:p-12 shadow-xl shadow-slate-200/50">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Internal Backlink CTA */}
                <div className="mt-16 animate-slide-up bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-2xl shadow-blue-500/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            Try the Tool Mentioned in this Post
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Experience the power of our professional utilities firsthand. Free, fast, and secure.
                        </p>
                        <Link
                            href={post.targetTool}
                            className="inline-flex items-center gap-3 bg-white text-blue-600 font-bold py-5 px-10 rounded-2xl hover:scale-105 transition-all shadow-xl"
                        >
                            Open This Tool <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
