'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Newspaper, Sparkles, Tag } from 'lucide-react';

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
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch all posts (large limit)
                const res = await fetch(`/api/blog?limit=1000`);
                const data = await res.json();
                if (data.posts) {
                    setPosts(data.posts);
                    setTotalPosts(data.total || data.posts.length);
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
        <div className="wup-page-shell">
            <section className="wup-page-hero">
                <div className="container-custom text-center">
                    <div className="wup-kicker">
                        <Newspaper className="h-3.5 w-3.5" />
                        Developer Insights
                    </div>
                    <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-7xl">
                        Developer Insights
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600 md:text-xl">
                        Curated news, tutorials, and updates from the best engineering teams around the world.
                    </p>
                    {totalPosts > 0 && (
                        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                            {totalPosts.toLocaleString()} articles and counting
                        </p>
                    )}
                </div>
            </section>

            <section className="wup-section">
                <div className="container-custom">
                {loading ? (
                    <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 animate-pulse bg-[#fbfbf4] p-6">
                                <div className="mb-4 h-4 w-1/4 bg-neutral-900/10"></div>
                                <div className="mb-4 h-8 w-3/4 bg-neutral-900/10"></div>
                                <div className="mb-4 h-20 w-full bg-neutral-900/10"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-px border border-neutral-900/15 bg-neutral-900/15 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post, index) => (
                                <Link
                                    href={`/blog/${post.slug}`}
                                    key={post._id}
                                    className="group flex flex-col overflow-hidden bg-[#fbfbf4] transition-colors hover:bg-white"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {post.mainImage && (
                                        <div className="relative h-48 w-full overflow-hidden border-b border-neutral-900/15">
                                            <img
                                                src={post.mainImage}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            {post.sourceDomain === 'webutilspro.com' ? (
                                                <span className="flex items-center gap-1 border border-neutral-950 bg-neutral-950 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                                    <Sparkles className="h-3 w-3" />
                                                    Pro Guide
                                                </span>
                                            ) : (
                                                <span className="border border-neutral-900/15 bg-[#fbff5d] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-900">
                                                    {post.sourceDomain}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-xs text-neutral-500">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(post.publishedAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
                                            </span>
                                        </div>

                                        <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-neutral-950">
                                            {post.title}
                                        </h2>

                                        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center gap-2">
                                            {post.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 border border-neutral-900/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                                                    <Tag className="h-3 w-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {!loading && posts.length === 0 && (
                    <div className="border border-neutral-900/15 bg-[#fbfbf4] py-20 text-center">
                        <p className="text-lg text-neutral-600">Thinking regarding the latest tech news...</p>
                        <p className="mt-2 text-sm text-neutral-500">Check back in a few minutes!</p>
                    </div>
                )}
                </div>
            </section>
            </div>
    );
}
