'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    createdAt: string;
    author: string;
}

export default function BlogIndex() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blog');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            toast.error('Failed to load blog posts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen gradient-bg pt-20 pb-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="animate-slide-up">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                            Developer <span className="text-gradient">Insights</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            Deep dives into modern development, tool optimizations, and productivity hacks.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card h-96 animate-pulse bg-white/50" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug}`}
                                className="card group flex flex-col hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="mb-4">
                                    <span className="category-badge uppercase tracking-wider text-[10px]">
                                        {post.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles yet</h2>
                        <p className="text-gray-500 mb-8">Our AI is currently drafting new insights for you. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
