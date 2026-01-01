'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, ExternalLink, Sparkles } from 'lucide-react';

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

export default function LatestInsights() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch from API, reliable next.js proxy handlings
                const res = await fetch('/api/blog?limit=3');
                const data = await res.json();
                if (data.posts) {
                    setPosts(data.posts.slice(0, 3)); // Ensure only 3
                }
            } catch (error) {
                console.error('Failed to fetch latest insights', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container-custom relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" />
                            <span>Fresh from the Blog</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Latest <span className="text-blue-600">Insights</span>
                        </h2>
                        <p className="text-lg text-slate-600 font-medium max-w-xl">
                            Curated tech news, tutorials, and industry updates automagically delivered to you.
                        </p>
                    </div>
                    <div>
                        <Link href="/blog" className="group flex items-center gap-2 text-slate-900 font-bold hover:text-blue-600 transition-colors">
                            <span>View All Articles</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-6 h-64 animate-pulse border border-slate-100">
                                <div className="h-48 bg-slate-200 rounded-xl mb-4 w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post._id}
                                className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-500/30 transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden bg-slate-100">
                                    {post.mainImage ? (
                                        <img
                                            src={post.mainImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Sparkles className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">
                                            {post.sourceDomain}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center text-blue-600 text-sm font-bold group-hover:gap-2 transition-all">
                                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
