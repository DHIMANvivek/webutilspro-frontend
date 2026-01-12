import CyberTrace from '@/components/tools/CyberTrace';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cyber Trace - 3D Visual Traceroute & Server Location Finder',
    description: 'Visualize the physical path of network traffic on a 3D globe. Free online tool to find server locations, track IP routes, and map website hosting details.',
    keywords: ['traceroute', 'ip location', 'server finder', 'cyber map', '3d globe', 'network visualizer', 'geoip', 'hosting location']
};

export default function CyberTracePage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                        CYBER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">TRACE</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                        The advanced <strong className="text-slate-900">3D Network Intelligence</strong> tool. Visualize server infrastructure and trace data paths across the globe in real-time.
                    </p>
                </div>

                <CyberTrace />

                <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature Cards */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Server Geolocation</h3>
                        <p className="text-slate-500 leading-relaxed">Instantly convert any Domain or IP address into physical GPS coordinates. See exactly where your data lives—down to the city and ISP.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Infrastructure Verification</h3>
                        <p className="text-slate-500 leading-relaxed">Audit your hosting provider's claims. Verify if your "local" server is actually hosted offshore or check Content Delivery Network (CDN) distribution nodes.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Visual Traceroute</h3>
                        <p className="text-slate-500 leading-relaxed">Forget command line terminal outputs. Visualize the network path with cinematic 3D arcs that represent the flow of data packets across fiber optic lines.</p>
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className="mt-20 max-w-4xl mx-auto prose prose-slate prose-lg">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">How Cyber Trace Works</h2>
                    <p>
                        Cyber Trace utilizes advanced <strong>GeoIP resolution technology</strong> combined with WebGL rendering to create a real-time visualization of the internet's physical infrastructure.
                    </p>
                    <p>
                        When you enter a domain, our system:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                        <li><strong>Resolves DNS:</strong> Converts the hostname (e.g., <code>google.com</code>) into its primary IP address.</li>
                        <li><strong>Locates Data Center:</strong> Queries global routing databases to identify the specific data center, city, and country where that IP is announced.</li>
                        <li><strong>Identifies ISP:</strong> Determines the Internet Service Provider or Autonomous System (AS) handling the traffic.</li>
                        <li><strong>Renders 3D Path:</strong> Calculates the Great Circle path from your current location to the target server and animates the connection.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why use a 3D Traceroute?</h3>
                    <p className="text-slate-600">
                        Traditional network tools like <code>ping</code> or <code>tracert</code> provide text-based outputs that can be hard to interpret. <strong>Cyber Trace</strong> turns abstract network data into actionable, visual intelligence. It is widely used by:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 not-prose mt-6">
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                            <strong className="block text-slate-900 mb-1">Security Researchers</strong>
                            <span className="text-sm text-slate-500">To identify suspicious server locations and phishing hosting.</span>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                            <strong className="block text-slate-900 mb-1">System Admins</strong>
                            <span className="text-sm text-slate-500">To debug latency issues and verify CDN edge locations.</span>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                            <strong className="block text-slate-900 mb-1">Developers</strong>
                            <span className="text-sm text-slate-500">To understand where their APIs and databases physically reside.</span>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                            <strong className="block text-slate-900 mb-1">Privacy Enthusiasts</strong>
                            <span className="text-sm text-slate-500">To see which legal jurisdiction holds their data.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
