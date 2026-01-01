'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    publishedAt: string;
    sourceDomain: string;
    originalUrl: string;
    tags: string[];
}

export default function BlogPostPage() {
    const params = useParams(); // Unwrap params using hook
    const slug = params?.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/blog/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                }
            } catch (error) {
                console.error('Failed to fetch post', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post not found</h1>
                <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Articles
                </Link>

                <article className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800">
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
                            <span className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                <Calendar className="w-3 h-3 mr-2" />
                                {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </span>
                            <span className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                {post.sourceDomain}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex justify-center gap-2 flex-wrap">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Content using dangerouslySetInnerHTML since our backend returns HTML */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-blue prose-headings:font-bold prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Original Source</h3>
                                <p className="text-slate-500 text-sm">Read the full original article on {post.sourceDomain}</p>
                            </div>
                            <a
                                href={post.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold transition-all transform hover:-translate-y-1"
                            >
                                Read Original <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
