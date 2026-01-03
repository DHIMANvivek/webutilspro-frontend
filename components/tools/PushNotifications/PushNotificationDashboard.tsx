'use client';

import { useState, useEffect } from 'react';
import {
    Bell, Plus, Send, Users, BarChart3, Settings, Copy, Check,
    ExternalLink, Calendar, Target, Image as ImageIcon, Link as LinkIcon,
    Trash2, Eye, TrendingUp, ArrowRight, LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Project {
    _id: string;
    id?: string; // Add id as optional for compatibility
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

interface Subscriber {
    _id: string;
    metadata: {
        userAgent?: string;
        subscribedUrl?: string;
        tags?: string[];
    };
    subscribedAt: string;
    lastActive: string;
}

interface Analytics {
    sent: number;
    delivered: number;
    clicked: number;
    failed: number;
    clickRate: string;
    deliveryRate: string;
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

    // Firebase config form state
    const [firebaseConfigForm, setFirebaseConfigForm] = useState({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '',
    });

    // Tab data state
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [tabLoading, setTabLoading] = useState(false);

    // Load projects on mount
    useEffect(() => {
        loadProjects();
    }, []);

    // Load full project details when settings tab is active
    useEffect(() => {
        if (activeTab === 'settings' && selectedProject) {
            fetchFullProjectDetails(selectedProject._id || (selectedProject as any).id);
        }
    }, [activeTab, selectedProject]);

    // Fetch tab-specific data when active tab changes
    useEffect(() => {
        if (!selectedProject) return;

        const projectId = selectedProject._id || (selectedProject as any).id;

        if (activeTab === 'history') {
            fetchNotifications(projectId);
        } else if (activeTab === 'subscribers') {
            fetchSubscribers(projectId);
        } else if (activeTab === 'analytics') {
            fetchAnalytics(projectId);
        }
    }, [activeTab, selectedProject]);

    const fetchNotifications = async (projectId: string) => {
        setTabLoading(true);
        try {
            const response = await fetch(`/api/notifications/projects/${projectId}/notifications`);
            const data = await response.json();
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setTabLoading(false);
        }
    };

    const fetchSubscribers = async (projectId: string) => {
        setTabLoading(true);
        try {
            const response = await fetch(`/api/notifications/projects/${projectId}/subscribers`);
            const data = await response.json();
            if (data.success) {
                setSubscribers(data.subscribers);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setTabLoading(false);
        }
    };

    const fetchAnalytics = async (projectId: string) => {
        setTabLoading(true);
        try {
            const response = await fetch(`/api/notifications/projects/${projectId}/analytics`);
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setTabLoading(false);
        }
    };

    const fetchFullProjectDetails = async (projectId: string) => {
        try {
            const response = await fetch(`/api/notifications/projects/${projectId}`);
            const data = await response.json();
            if (data.success && data.project.firebaseConfig) {
                setFirebaseConfigForm({
                    apiKey: data.project.firebaseConfig.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
                    authDomain: data.project.firebaseConfig.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
                    projectId: data.project.firebaseConfig.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
                    storageBucket: data.project.firebaseConfig.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
                    messagingSenderId: data.project.firebaseConfig.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
                    appId: data.project.firebaseConfig.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
                    vapidKey: data.project.firebaseConfig.vapidKey || process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '',
                });
            }
        } catch (error) {
            console.error('Error fetching full project details:', error);
        }
    };

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
                // We check both _id and id to handle discrepancies between creation/list responses
                const userProjects = data.projects.filter((p: Project) =>
                    userProjectIds.includes(p._id) || (p.id && userProjectIds.includes(p.id))
                );
                setProjects(userProjects);

                // If no project is selected or current selected project is not in the list, select the first one
                if (userProjects.length > 0) {
                    const currentSelectedId = localStorage.getItem('pn_selected_project_id');
                    const existingProject = userProjects.find((p: Project) => p._id === currentSelectedId || (p.id && p.id === currentSelectedId));

                    if (existingProject) {
                        setSelectedProject(existingProject);
                    } else if (!selectedProject) {
                        setSelectedProject(userProjects[0]);
                    }
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
                        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
                        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
                        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
                        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
                        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '',
                    },
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Store this project ID in localStorage for this user
                const projectId = data.project.id || data.project._id;
                const userProjectIds = JSON.parse(localStorage.getItem('pn_user_projects') || '[]');
                if (!userProjectIds.includes(projectId)) {
                    userProjectIds.push(projectId);
                }
                localStorage.setItem('pn_user_projects', JSON.stringify(userProjectIds));

                // Store as selected project
                localStorage.setItem('pn_selected_project_id', projectId);

                toast.success('Project created successfully!');
                setShowCreateModal(false);
                setNewProjectName('');
                setNewProjectEmail('');

                // Refresh projects and specify the new project to be selected
                await loadProjects();
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

    const saveProjectSettings = async () => {
        if (!selectedProject) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/notifications/projects/${selectedProject._id || (selectedProject as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseConfig: firebaseConfigForm,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Settings saved successfully!');
            } else {
                toast.error(data.message || 'Failed to save settings');
            }
        } catch (error) {
            toast.error('Failed to save settings');
            console.error(error);
        } finally {
            setLoading(false);
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
                <Breadcrumbs
                    items={[
                        { name: 'Tools', href: '/#tools', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                        { name: 'Push Notifications', href: '/tools/push-notifications' },
                        { name: 'Dashboard', href: '/tools/push-notifications/dashboard' },
                    ]}
                />
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
                                                    localStorage.setItem('pn_selected_project_id', project._id || project.id || '');
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

                                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                <Settings className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            Firebase Configuration
                                        </h3>
                                        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
                                            <p className="text-sm font-medium text-blue-700">
                                                💡 Using our default Firebase config (webutilspro.com).
                                                <span className="block md:inline ml-0 md:ml-1 text-blue-600/80">You can replace it with your own credentials anytime.</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'API Key', key: 'apiKey' },
                                            { label: 'Auth Domain', key: 'authDomain' },
                                            { label: 'Project ID', key: 'projectId' },
                                            { label: 'Storage Bucket', key: 'storageBucket' },
                                            { label: 'Messaging Sender ID', key: 'messagingSenderId' },
                                            { label: 'App ID', key: 'appId' },
                                            { label: 'VAPID Key (Web Push Certificate)', key: 'vapidKey' },
                                        ].map((field) => (
                                            <div key={field.key} className={field.key === 'vapidKey' ? 'md:col-span-2' : ''}>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={(firebaseConfigForm as any)[field.key]}
                                                    onChange={(e) => setFirebaseConfigForm({ ...firebaseConfigForm, [field.key]: e.target.value })}
                                                    placeholder={`Enter ${field.label}`}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            These credentials are required for the web widget to connect to Firebase.
                                        </p>
                                        <button
                                            onClick={saveProjectSettings}
                                            disabled={loading}
                                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {loading ? 'Saving...' : 'Save Configuration'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Notification History
                                    </h2>
                                    <button
                                        onClick={() => selectedProject && fetchNotifications(selectedProject._id)}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {tabLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            No notifications yet
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Sent notifications will appear here
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('send')}
                                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            Send Your First Notification
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b-2 border-gray-100">
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Notification</th>
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Status</th>
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Stats</th>
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Sent Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y-2 divide-gray-50">
                                                    {notifications.map((notification) => (
                                                        <tr key={notification._id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {notification.icon ? (
                                                                        <img src={notification.icon} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                            <Bell className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 leading-tight mb-1">{notification.title}</p>
                                                                        <p className="text-sm text-gray-600 line-clamp-1">{notification.body}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${notification.status === 'sent' ? 'bg-green-100 text-green-700' :
                                                                    notification.status === 'sending' ? 'bg-blue-100 text-blue-700' :
                                                                        notification.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {notification.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-center">
                                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Sent</p>
                                                                        <p className="font-bold text-gray-900">{notification.stats.sentCount}</p>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Clicks</p>
                                                                        <p className="font-bold text-gray-900">{notification.stats.clickedCount}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                                <br />
                                                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subscribers Tab */}
                        {activeTab === 'subscribers' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Subscriber Management
                                    </h2>
                                    <button
                                        onClick={() => selectedProject && fetchSubscribers(selectedProject._id)}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {tabLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : subscribers.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            No subscribers yet
                                        </h3>
                                        <p className="text-gray-600">
                                            Integrate the widget on your site to start growing your reach
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden text-sm">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b-2 border-gray-100">
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Subscriber</th>
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Platform / Browser</th>
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Subscribed From</th>
                                                        <th className="px-6 py-4 font-black text-gray-900 uppercase tracking-wider text-xs">Joined</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y-2 divide-gray-50">
                                                    {subscribers.map((subscriber) => (
                                                        <tr key={subscriber._id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                                        {subscriber._id.substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <code className="text-xs text-gray-500 font-mono">{subscriber._id}</code>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-gray-900 font-medium truncate max-w-[200px]" title={subscriber.metadata.userAgent}>
                                                                    {subscriber.metadata.userAgent || 'Unknown'}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-gray-600 truncate max-w-[200px]" title={subscriber.metadata.subscribedUrl}>
                                                                    {subscriber.metadata.subscribedUrl || 'Unknown'}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600">
                                                                {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900">
                                        Analytics Dashboard
                                    </h2>
                                    <button
                                        onClick={() => selectedProject && fetchAnalytics(selectedProject._id)}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {tabLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : !analytics ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            No analytics data
                                        </h3>
                                        <p className="text-gray-600">
                                            Start sending notifications to see performance data
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Main Stats Cards */}
                                        {[
                                            { label: 'Total Sent', value: analytics.sent, icon: <Send className="w-5 h-5" />, color: 'blue' },
                                            { label: 'Delivered', value: analytics.delivered, icon: <Check className="w-5 h-5" />, color: 'green' },
                                            { label: 'Clicked', value: analytics.clicked, icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
                                            { label: 'Failed', value: analytics.failed, icon: <Trash2 className="w-5 h-5" />, color: 'red' },
                                        ].map((stat) => {
                                            const colors: Record<string, string> = {
                                                blue: 'bg-blue-50 border-blue-100 text-blue-600 text-blue-900',
                                                green: 'bg-green-50 border-green-100 text-green-600 text-green-900',
                                                purple: 'bg-purple-50 border-purple-100 text-purple-600 text-purple-900',
                                                red: 'bg-red-50 border-red-100 text-red-600 text-red-900',
                                            };

                                            // Split classes for better targeting
                                            const bgClass = stat.color === 'blue' ? 'bg-blue-50' : stat.color === 'green' ? 'bg-green-50' : stat.color === 'purple' ? 'bg-purple-50' : 'bg-red-50';
                                            const borderClass = stat.color === 'blue' ? 'border-blue-100' : stat.color === 'green' ? 'border-green-100' : stat.color === 'purple' ? 'border-purple-100' : 'border-red-100';
                                            const textPrimary = stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-red-600';
                                            const textDark = stat.color === 'blue' ? 'text-blue-900' : stat.color === 'green' ? 'text-green-900' : stat.color === 'purple' ? 'text-purple-900' : 'text-red-900';

                                            return (
                                                <div key={stat.label} className={`${bgClass} p-6 rounded-2xl border-2 ${borderClass}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className={`text-xs font-black ${textPrimary} uppercase tracking-wider`}>{stat.label}</p>
                                                        <div className={`p-2 bg-white rounded-lg shadow-sm ${textPrimary}`}>
                                                            {stat.icon}
                                                        </div>
                                                    </div>
                                                    <p className={`text-3xl font-black ${textDark}`}>
                                                        {stat.value.toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        })}

                                        {/* Rate Cards */}
                                        <div className="md:col-span-2 bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="relative z-10">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-6 text-center">Efficiency Metrics</p>
                                                <div className="grid grid-cols-2 gap-8 text-center">
                                                    <div>
                                                        <p className="text-4xl font-black text-blue-600 mb-2">{analytics.deliveryRate}%</p>
                                                        <p className="text-sm font-bold text-gray-600">Delivery Rate</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-4xl font-black text-purple-600 mb-2">{analytics.clickRate}%</p>
                                                        <p className="text-sm font-bold text-gray-600">Click-through Rate</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Decorative Background Element */}
                                            <div className="absolute -bottom-6 -right-6 opacity-5">
                                                <BarChart3 className="w-32 h-32" />
                                            </div>
                                        </div>

                                        {/* Performance Info Card */}
                                        <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-slate-800 p-6 rounded-2xl text-white">
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-blue-400" />
                                                Performance Insights
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                                    <span className="text-sm text-gray-300">Total Reach</span>
                                                    <span className="font-black">{selectedProject?.stats.totalSubscribers.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                                    <span className="text-sm text-gray-300">Active Campaign Pulse</span>
                                                    <span className="font-black text-green-400">Stable</span>
                                                </div>
                                                <p className="text-xs text-gray-400 italic mt-4">
                                                    * Rates are calculated based on successful deliveries.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
