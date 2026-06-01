'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    const params = useParams();
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
            <div className="wup-page-shell flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-900/15 border-t-neutral-950"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="wup-page-shell flex flex-col items-center justify-center p-6 text-center">
                <h1 className="mb-4 text-3xl font-semibold text-neutral-950">Post not found</h1>
                <Link href="/blog" className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600 hover:text-neutral-950">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="wup-page-shell">
            <section className="wup-page-hero">
                <div className="container-custom max-w-4xl">
                <Link href="/blog" className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:text-neutral-950">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Articles
                </Link>

                <article className="border border-neutral-900/15 bg-[#fbfbf4] p-6 md:p-10">
                    <header className="mb-10">
                        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                            <span className="flex items-center gap-2 border border-neutral-900/15 bg-white px-3 py-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </span>
                            <span className="flex items-center border border-neutral-900/15 bg-[#fbff5d] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-900">
                                {post.sourceDomain}
                            </span>
                        </div>

                        <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-normal text-neutral-950 md:text-6xl">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 border border-neutral-900/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Content using dangerouslySetInnerHTML since our backend returns HTML */}
                    <div
                        className="wup-prose break-words [&_code]:break-all [&_img]:border [&_img]:border-neutral-900/15"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-12 border-t border-neutral-900/10 pt-8">
                        <div className="flex flex-col justify-between gap-6 border border-neutral-900/15 bg-[#fbff5d] p-6 md:flex-row md:items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-950">Original Source</h3>
                                <p className="text-sm text-neutral-700">Read the full original article on {post.sourceDomain}</p>
                            </div>
                            <a
                                href={post.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                            >
                                Read Original <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </article>
                </div>
            </section>
        </div>
    );
}
