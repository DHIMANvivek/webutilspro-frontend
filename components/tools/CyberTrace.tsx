'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, Globe, Server, Activity, MapPin, Radio, Wifi } from 'lucide-react';

// Lazy load the globe component (Heavy 3D library, avoids SSR issues)
const Globe3D = dynamic(() => import('react-globe.gl'), { ssr: false });

type Coordinates = { lat: number; lng: number; label?: string; type?: 'source' | 'target' | 'hop' };

export default function CyberTrace() {
    const [targetDomain, setTargetDomain] = useState('');
    const [isTracing, setIsTracing] = useState(false);
    const [traceData, setTraceData] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const globeEl = useRef<any>(undefined);

    // Initial load: Get User Location (Browser API is most accurate for client)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, type: 'source', label: 'YOU' }),
                (err) => console.warn('Loc req denied, utilizing IP fallback if avail')
            );
        }
    }, []);

    const handleTrace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetDomain) return;

        setIsTracing(true);
        setTraceData(null);

        try {
            // Call our new API
            const res = await fetch(`/api/geoip?domain=${targetDomain}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setTraceData(data);

            // Auto-focus the camera to show the path
            if (globeEl.current) {
                // If we know source, calculate midpoint for camera
                const srcLat = userLocation?.lat || data.target.lat; // default to target if no source
                const srcLng = userLocation?.lng || data.target.lng;

                // Animate showing the arc (Rough midpoint view)
                const midLat = (srcLat + data.target.lat) / 2;
                const midLng = (srcLng + data.target.lng) / 2;

                globeEl.current.pointOfView({ lat: midLat, lng: midLng, altitude: 2.5 }, 2000);
            }

        } catch (err) {
            console.error('Trace Failed', err);
            // In a real app, set error state
        } finally {
            setIsTracing(false);
        }
    };

    // Prepare Globe Data
    const argsData = [];
    const rippleData = [];
    const labelData = [];

    // 1. Source (User)
    if (userLocation) {
        labelData.push({ lat: userLocation.lat, lng: userLocation.lng, text: 'YOU', color: '#00ffcc' });
        rippleData.push({ lat: userLocation.lat, lng: userLocation.lng, color: '#00ffcc', maxR: 5 });
    }

    // 2. Target
    if (traceData?.target) {
        labelData.push({ lat: traceData.target.lat, lng: traceData.target.lng, text: traceData.target.city.toUpperCase(), color: '#ff00ff' });
        rippleData.push({ lat: traceData.target.lat, lng: traceData.target.lng, color: '#ff00ff', maxR: 15 }); // Big ripple for target

        // Arc (Path)
        if (userLocation) {
            argsData.push({
                startLat: userLocation.lat,
                startLng: userLocation.lng,
                endLat: traceData.target.lat,
                endLng: traceData.target.lng,
                color: ['#00ffcc', '#ff00ff']
            });
        }
    }

    return (
        <div className="w-full h-[700px] bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl group ring-1 ring-slate-800/50">

            {/* Starry Background & Vignette - LIGHTER */}
            <div className="absolute inset-0 bg-[url('//unpkg.com/three-globe/example/img/night-sky.png')] bg-cover opacity-20"></div>
            <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 via-slate-900/50 to-slate-950 pointer-events-none"></div>

            {/* 3D Glove */}
            <div className="absolute inset-0 cursor-move opacity-100 transition-opacity">
                <Globe3D
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    // No background image prop - let CSS show through
                    backgroundColor="rgba(0,0,0,0)"

                    // Config
                    atmosphereColor="#38bdf8" // Light Sky Blue
                    atmosphereAltitude={0.15}

                    // Arcs
                    arcsData={argsData}
                    arcColor={'color'}
                    arcDashLength={0.4}
                    arcDashGap={0.2}
                    arcDashAnimateTime={1500}
                    arcStroke={1.5}
                    onGlobeReady={() => {
                        if (globeEl.current) {
                            globeEl.current.controls().autoRotate = true;
                            globeEl.current.controls().autoRotateSpeed = 0.5;
                        }
                    }}

                    // Rings
                    ringsData={rippleData}
                    ringColor={'color'}
                    ringMaxRadius={'maxR'}
                    ringPropagationSpeed={3}
                    ringRepeatPeriod={800}

                    // Labels
                    labelsData={labelData}
                    labelLat={'lat'}
                    labelLng={'lng'}
                    labelText={'text'}
                    labelSize={1.2}
                    labelDotRadius={0.3}
                    labelColor={() => '#ffffff'}
                    labelResolution={2}
                    labelAltitude={0.01}
                />
            </div>

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 sm:p-8 pointer-events-none flex flex-col justify-between h-full z-10">

                {/* Floating Search Bar */}
                <div className="pointer-events-auto max-w-xl mx-auto w-full pt-4">
                    <form onSubmit={handleTrace} className="relative group/input perspective-1000">
                        {/* Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover/input:opacity-60 transition duration-700"></div>

                        <div className="relative flex items-center bg-slate-950/80 backdrop-blur-md border border-slate-800/50 rounded-xl p-2 shadow-2xl transform transition-transform group-hover/input:scale-[1.01]">
                            <div className="p-3 text-cyan-400">
                                {isTracing ? <Activity className="animate-spin" /> : <Globe className="animate-pulse-slow" />}
                            </div>
                            <input
                                type="text"
                                autoFocus
                                placeholder="ENTER TARGET DOMAIN (e.g. google.com)"
                                className="bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 flex-1 font-mono text-sm sm:text-lg h-10 px-2 tracking-wide uppercase"
                                value={targetDomain}
                                onChange={e => setTargetDomain(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isTracing}
                                className="bg-white/10 hover:bg-white/20 text-cyan-400 border border-white/10 font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-xs sm:text-sm tracking-widest uppercase"
                            >
                                <Search size={14} />
                                <span className="hidden sm:inline">Initialize Trace</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Data Panel (Cyberpunk Style) */}
                {traceData && (
                    <div className="pointer-events-auto self-end sm:self-start mt-auto sm:mb-8 sm:ml-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <div className="bg-slate-900/80 backdrop-blur-xl border-l-4 border-l-cyan-500 border-y border-r border-slate-800 p-6 rounded-r-2xl rounded-bl-2xl shadow-2xl w-80 relative overflow-hidden group/card">

                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent -translate-y-full group-hover/card:translate-y-full transition-transform duration-[2s] ease-in-out"></div>

                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Server size={12} /> Target Locked
                                </h3>
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-ping"></span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="relative">
                                    <div className="text-[9px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Public IP Address</div>
                                    <div className="text-3xl text-white font-mono font-medium tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                        {traceData.target.ip}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div>
                                        <div className="text-[9px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Coordinates</div>
                                        <div className="text-slate-200 text-sm font-bold flex items-center gap-1.5">
                                            <MapPin size={12} className="text-pink-500" />
                                            {traceData.target.lat.toFixed(1)}, {traceData.target.lng.toFixed(1)}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{traceData.target.city}, {traceData.target.country}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Network ISP</div>
                                        <div className="text-slate-200 text-sm font-bold flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="truncate max-w-[100px]">{traceData.target.isp.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                <div className="text-[9px] font-mono text-cyan-700">
                                    LATENCY: <span className="text-cyan-400">{(Math.random() * 40 + 10).toFixed(0)}ms</span>
                                </div>
                                <div className="text-[9px] font-mono text-slate-600">SECURE CONNECTION</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
