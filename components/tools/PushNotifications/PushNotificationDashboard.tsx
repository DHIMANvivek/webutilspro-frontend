'use client';

import { useState, useEffect } from 'react';
import {
    Bell, Plus, Send, Users, BarChart3, Settings, Copy, Check,
    ExternalLink, Calendar, Target, Image as ImageIcon, Link as LinkIcon,
    Trash2, Eye, TrendingUp, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
    _id: string;
    name: string;
    apiKey: string;
    stats: {
        totalSubscribers: number;
        totalSent: number;
        totalClicked: number;
    };
    createdAt: string;
}

interface Notification {
    _id: string;
    title: string;
    body: string;
    icon?: string;
    image?: string;
    url?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    stats: {
        targetCount: number;
        sentCount: number;
        clickedCount: number;
    };
    createdAt: string;
    sentAt?: string;
}

export default function PushNotificationDashboard() {
    const [activeTab, setActiveTab] = useState<'send' | 'history' | 'subscribers' | 'analytics' | 'settings'>('send');
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [copiedApiKey, setCopiedApiKey] = useState(false);

    // Modal state for creating projects
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectEmail, setNewProjectEmail] = useState('');

    // Dropdown state
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Notification form state
    const [notificationForm, setNotificationForm] = useState({
        title: '',
        body: '',
        icon: '',
        image: '',
        url: '',
    });

    // Load projects on mount
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            // Get user's project IDs from localStorage
            const userProjectIds = JSON.parse(localStorage.getItem('pn_user_projects') || '[]');

            if (userProjectIds.length === 0) {
                setProjects([]);
                return;
            }

            const response = await fetch('/api/notifications/projects');
            const data = await response.json();
            if (data.success) {
                // Filter to only show projects created by this user (stored in localStorage)
                const userProjects = data.projects.filter((p: Project) =>
                    userProjectIds.includes(p._id)
                );
                setProjects(userProjects);
                if (userProjects.length > 0) {
                    setSelectedProject(userProjects[0]);
                }
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    const createNewProject = async () => {
        if (!newProjectName.trim()) {
            toast.error('Project name is required');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/notifications/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProjectName,
                    ownerEmail: newProjectEmail || undefined,
                    firebaseConfig: {
                        apiKey: '',
                        authDomain: '',
                        projectId: '',
                        storageBucket: '',
                        messagingSenderId: '',
                        appId: '',
                        vapidKey: '',
                    },
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Store this project ID in localStorage for this user
                const userProjectIds = JSON.parse(localStorage.getItem('pn_user_projects') || '[]');
                userProjectIds.push(data.project.id || data.project._id);
                localStorage.setItem('pn_user_projects', JSON.stringify(userProjectIds));

                toast.success('Project created successfully!');
                setShowCreateModal(false);
                setNewProjectName('');
                setNewProjectEmail('');
                loadProjects();
            } else {
                toast.error(data.message || 'Failed to create project');
            }
        } catch (error) {
            toast.error('Failed to create project');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sendNotification = async () => {
        if (!selectedProject) {
            toast.error('Please select a project first');
            return;
        }

        if (!notificationForm.title || !notificationForm.body) {
            toast.error('Title and body are required');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': selectedProject.apiKey,
                },
                body: JSON.stringify({
                    projectId: selectedProject._id,
                    ...notificationForm,
                    targeting: { type: 'all' },
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(`Notification sent to ${data.notification.sentCount} subscribers!`);
                setNotificationForm({
                    title: '',
                    body: '',
                    icon: '',
                    image: '',
                    url: '',
                });
                loadProjects(); // Refresh stats
            } else {
                toast.error(data.message || 'Failed to send notification');
            }
        } catch (error) {
            toast.error('Failed to send notification');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyApiKey = () => {
        if (selectedProject) {
            navigator.clipboard.writeText(selectedProject.apiKey);
            setCopiedApiKey(true);
            toast.success('API key copied to clipboard!');
            setTimeout(() => setCopiedApiKey(false), 2000);
        }
    };

    const copyEmbedCode = () => {
        if (selectedProject) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webutilspro.com';
            const embedCode = `<script src="${siteUrl}/push-widget.js" data-api-key="${selectedProject.apiKey}" async></script>`;
            navigator.clipboard.writeText(embedCode);
            toast.success('Embed code copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">
                                Push Notification Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage your web push notifications
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Custom Project Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 focus:outline-none focus:border-blue-500 min-w-[200px] flex items-center justify-between gap-2"
                                >
                                    <span>{selectedProject?.name || 'No projects'}</span>
                                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && projects.length > 0 && (
                                    <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {projects.map(project => (
                                            <button
                                                key={project._id}
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`w-full px-4 py-3 text-left font-semibold transition-colors ${selectedProject?._id === project._id
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {project.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Project
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    {selectedProject && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                                            Subscribers
                                        </p>
                                        <p className="text-3xl font-black text-blue-900">
                                            {selectedProject.stats.totalSubscribers.toLocaleString()}
                                        </p>
                                    </div>
                                    <Users className="w-10 h-10 text-blue-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-green-600 uppercase tracking-wide">
                                            Total Sent
                                        </p>
                                        <p className="text-3xl font-black text-green-900">
                                            {selectedProject.stats.totalSent.toLocaleString()}
                                        </p>
                                    </div>
                                    <Send className="w-10 h-10 text-green-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-purple-600 uppercase tracking-wide">
                                            Total Clicks
                                        </p>
                                        <p className="text-3xl font-black text-purple-900">
                                            {selectedProject.stats.totalClicked.toLocaleString()}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-purple-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-4 font-bold transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Send Tab */}
                        {activeTab === 'send' && (
                            <div className="max-w-3xl mx-auto">
                                {/* Getting Started Notice - Only show if project has 0 subscribers */}
                                {selectedProject && selectedProject.stats.totalSubscribers === 0 && (
                                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <Settings className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                                    🎉 Project Created! Get Your Integration Code
                                                </h3>
                                                <p className="text-gray-700 mb-3 text-sm">
                                                    Before you can send notifications, you need to add the widget to your website so users can subscribe.
                                                </p>
                                                <button
                                                    onClick={() => setActiveTab('settings')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Go to Settings for API Key & Embed Code
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h2 className="text-2xl font-black text-gray-900 mb-6">
                                    Compose Notification
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={notificationForm.title}
                                            onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                                            placeholder="e.g., New Feature Released!"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                            maxLength={50}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {notificationForm.title.length}/50 characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            value={notificationForm.body}
                                            onChange={(e) => setNotificationForm({ ...notificationForm, body: e.target.value })}
                                            placeholder="e.g., Check out our latest features and improvements..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium resize-none"
                                            rows={3}
                                            maxLength={200}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {notificationForm.body.length}/200 characters
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <ImageIcon className="w-4 h-4 inline mr-1" />
                                                Icon URL
                                            </label>
                                            <input
                                                type="url"
                                                value={notificationForm.icon}
                                                onChange={(e) => setNotificationForm({ ...notificationForm, icon: e.target.value })}
                                                placeholder="https://example.com/icon.png"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <ImageIcon className="w-4 h-4 inline mr-1" />
                                                Image URL
                                            </label>
                                            <input
                                                type="url"
                                                value={notificationForm.image}
                                                onChange={(e) => setNotificationForm({ ...notificationForm, image: e.target.value })}
                                                placeholder="https://example.com/image.png"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            <LinkIcon className="w-4 h-4 inline mr-1" />
                                            Click Action URL
                                        </label>
                                        <input
                                            type="url"
                                            value={notificationForm.url}
                                            onChange={(e) => setNotificationForm({ ...notificationForm, url: e.target.value })}
                                            placeholder="https://example.com/landing-page"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <p className="text-sm text-gray-600">
                                            This will be sent to <span className="font-bold text-gray-900">
                                                {selectedProject?.stats.totalSubscribers || 0}
                                            </span> subscribers
                                        </p>

                                        <button
                                            onClick={sendNotification}
                                            disabled={loading || !selectedProject}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            {loading ? 'Sending...' : 'Send Notification'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && selectedProject && (
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">
                                        Project Settings
                                    </h2>
                                    <p className="text-gray-600">
                                        Configuration and integration details
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-blue-600" />
                                        API Key
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 px-4 py-2 bg-white rounded-lg text-sm font-mono border border-gray-300">
                                            {selectedProject.apiKey}
                                        </code>
                                        <button
                                            onClick={copyApiKey}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            {copiedApiKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copiedApiKey ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5 text-blue-600" />
                                        Embed Code
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Add this code to your website's HTML to enable push notifications:
                                    </p>
                                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                        <code>{`<script src="${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://webutilspro.com')}/push-widget.js" data-api-key="${selectedProject.apiKey}" async></script>`}</code>
                                    </div>
                                    <button
                                        onClick={copyEmbedCode}
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy Embed Code
                                    </button>
                                </div>

                                <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl">
                                    <h3 className="font-bold text-yellow-900 mb-2">
                                        ⚙️ Firebase Configuration Required
                                    </h3>
                                    <p className="text-sm text-yellow-800">
                                        To use push notifications, you need to set up a Firebase project and add your credentials to the backend.
                                        See the documentation for setup instructions.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Other tabs placeholders */}
                        {activeTab === 'history' && (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Notification History
                                </h3>
                                <p className="text-gray-600">
                                    View all sent and scheduled notifications here
                                </p>
                            </div>
                        )}

                        {activeTab === 'subscribers' && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Subscriber Management
                                </h3>
                                <p className="text-gray-600">
                                    Manage and segment your subscribers
                                </p>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="text-center py-12">
                                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Analytics Dashboard
                                </h3>
                                <p className="text-gray-600">
                                    Track your notification performance
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Create New Project</h2>
                        <p className="text-gray-600 mb-6">Set up a new push notification project for your website</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="e.g., My Website"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Your Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={newProjectEmail}
                                    onChange={(e) => setNewProjectEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewProjectName('');
                                    setNewProjectEmail('');
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createNewProject}
                                disabled={loading || !newProjectName.trim()}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                            >
                                {loading ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const tabs = [
    { id: 'send', label: 'Send', icon: <Send className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <Calendar className="w-5 h-5" /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Users className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];
