import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Rocket, Code2, Users, BarChart3, Globe, Zap, Shield, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Push Notification Manager - WebUtilsPro',
    description: 'Add web push notifications to your website in minutes. Manage subscribers, send notifications, and track analytics all from one powerful dashboard.',
    keywords: 'push notifications, web push, FCM, Firebase Cloud Messaging, notification service, browser notifications, developer tools',
};

export default function PushNotificationsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <section className="container-custom py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-bold text-sm mb-6">
                        <Rocket className="w-4 h-4" />
                        <span>NEW TOOL</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        Add Push Notifications to
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Your Website</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Powerful web push notifications made simple. Engage visitors, boost conversions,
                        and keep users coming back with our developer-friendly notification service.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/tools/push-notifications/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-blue-500/30"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <Link
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
                        >
                            <Code2 className="w-5 h-5" />
                            View Features
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container-custom py-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-gray-600 text-lg">
                        A complete push notification solution for modern websites
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="container-custom py-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Simple Integration
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Get up and running in minutes with our easy 3-step process
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 h-full">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-2xl rounded-xl flex items-center justify-center mb-4">
                                    {index + 1}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {step.description}
                                </p>
                                {step.code && (
                                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
                                        <code>{step.code}</code>
                                    </pre>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                    <ArrowRight className="w-8 h-8 text-blue-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container-custom py-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
                    <Bell className="w-16 h-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-4xl font-black mb-4">
                        Ready to Engage Your Users?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Join developers who trust our push notification service to keep their users engaged
                    </p>
                    <Link
                        href="/tools/push-notifications/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
                    >
                        Start Sending Notifications
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

const features = [
    {
        icon: <Bell className="w-7 h-7 text-white" />,
        title: 'Rich Notifications',
        description: 'Send notifications with images, icons, action buttons, and custom URLs for enhanced engagement.',
    },
    {
        icon: <Users className="w-7 h-7 text-white" />,
        title: 'Subscriber Management',
        description: 'Manage your subscribers with powerful segmentation, tagging, and filtering capabilities.',
    },
    {
        icon: <BarChart3 className="w-7 h-7 text-white" />,
        title: 'Real-time Analytics',
        description: 'Track delivery rates, click-through rates, and user engagement with detailed analytics.',
    },
    {
        icon: <Globe className="w-7 h-7 text-white" />,
        title: 'Cross-Browser Support',
        description: 'Works seamlessly across Chrome, Firefox, Safari, Edge, and mobile browsers.',
    },
    {
        icon: <Zap className="w-7 h-7 text-white" />,
        title: 'Instant & Scheduled',
        description: 'Send notifications immediately or schedule them for later with our flexible sending options.',
    },
    {
        icon: <Shield className="w-7 h-7 text-white" />,
        title: 'Secure & Reliable',
        description: 'Built on Firebase Cloud Messaging with enterprise-grade security and 99.9% uptime.',
    },
];

const steps = [
    {
        title: 'Create Project',
        description: 'Set up your project in the dashboard and get your API key instantly.',
        code: null,
    },
    {
        title: 'Add Script',
        description: 'Copy the embed code and paste it into your website.',
        code: '<script src="https://webutilspro.com/push-widget.js" data-api-key="your-key"></script>',
    },
    {
        title: 'Send Notifications',
        description: 'Start sending notifications through the dashboard or API.',
        code: null,
    },
];
