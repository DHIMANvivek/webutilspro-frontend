'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    sourceDomain: string;
    tags: string[];
    mainImage?: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Use relative path - Next.js rewrite will handle proxying to backend
                const res = await fetch('/api/blog');
                const data = await res.json();
                if (data.posts) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error('Failed to fetch blog posts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Developer <span className="text-blue-600">Insights</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Curated news, tutorials, and updates from the best engineering teams around the world.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-64 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
                                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded w-full mb-4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                                {post.mainImage && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img
                                            src={post.mainImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                            {post.sourceDomain}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 mt-auto">
                                        {post.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">Thinking regarding the latest tech news...</p>
                        <p className="text-sm text-slate-400 mt-2">Check back in a few minutes!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
