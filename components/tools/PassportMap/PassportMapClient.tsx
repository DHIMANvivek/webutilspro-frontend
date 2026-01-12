'use client';

import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, Globe, Shield, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';

// We'll use a simple SVG map or just a list for now to ensure speed, 
// constructing a full interactive map requires D3 or a large SVG library. 
// For V1, we'll focus on the "Power Stats" and the "Searchable List".
// Later we can add the SVG visualization.

export default function PassportMapClient() {
    const [passports, setPassports] = useState<string[]>([]);
    const [selectedPassport, setSelectedPassport] = useState<string>('United States'); // Default US
    const [requirements, setRequirements] = useState<Record<string, { status: string, name: string }>>({});
    const [loading, setLoading] = useState(true);
    const [searchDest, setSearchDest] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    useEffect(() => {
        // Fetch list of passports
        fetch('/api/passport/data').then(res => res.json()).then(data => {
            if (data.passports) setPassports(data.passports);
        });
    }, []);

    useEffect(() => {
        if (!selectedPassport) return;
        setLoading(true);
        fetch(`/api/passport/data?code=${selectedPassport}`)
            .then(res => res.json())
            .then(data => {
                setRequirements(data);
                setLoading(false);
            });
    }, [selectedPassport]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && !(event.target as Element).closest('.relative.z-50')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Derived stats
    const stats = React.useMemo(() => {
        const total = Object.keys(requirements).length;
        if (total === 0) return { free: 0, voa: 0, required: 0, score: 0 };

        const values = Object.values(requirements);
        const free = values.filter(r => r.status === 'visa-free' || r.status.startsWith('visa-free')).length;
        const voa = values.filter(r => r.status === 'visa-on-arrival' || r.status === 'permit-required').length;
        const eta = values.filter(r => r.status === 'eta').length;
        const required = values.filter(r => r.status === 'visa-required' || r.status === 'ban').length;

        return { free, voa: voa + eta, required, score: free + voa + eta };
    }, [requirements]);

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-slate-100 text-slate-700';
        if (status.startsWith('visa-free')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';

        switch (status) {
            case 'visa-on-arrival': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'permit-required': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'eta': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'visa-required': return 'bg-red-100 text-red-700 border-red-200';
            case 'ban': return 'bg-gray-800 text-gray-100 border-gray-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusText = (status: string) => {
        if (!status) return 'UNKNOWN';
        if (status === 'permit-required') return 'ENTRY PERMIT REQUIRED';
        if (status === 'eta') return 'eTA / e-VISA';

        // Handle "visa-free-90" -> "VISA FREE (90 DAYS)"
        if (status.startsWith('visa-free-')) {
            const days = status.replace('visa-free-', '');
            return `VISA FREE (${days} DAYS)`;
        }

        return status.replace(/-/g, ' ').toUpperCase();
    };

    // Filtered list for search
    const filteredDestinations = Object.entries(requirements).filter(([code, data]) => {
        // Search by Code OR Name
        const query = searchDest.toLowerCase();
        return code.toLowerCase().includes(query) || data.name.toLowerCase().includes(query);
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header / Selector */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Shield size={32} />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">I am a citizen of...</h2>
                    <div className="relative w-full md:w-72 z-50">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 flex items-center justify-between hover:border-blue-500 hover:ring-4 hover:ring-blue-500/10 transition-all shadow-sm"
                        >
                            <span className="truncate">{selectedPassport}</span>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                <div className="p-2 border-b border-slate-50 sticky top-0 bg-white z-10">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search country..."
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-blue-50 focus:text-blue-700 transition-colors"
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                                    {passports.filter(p => p.toLowerCase().includes(countrySearch.toLowerCase())).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                setSelectedPassport(p);
                                                setIsDropdownOpen(false);
                                                setCountrySearch('');
                                            }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${selectedPassport === p
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {p}
                                            {selectedPassport === p && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                    ))}
                                    {passports.filter(p => p.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
                                        <div className="px-4 py-8 text-center text-slate-400 text-sm font-medium">
                                            No countries found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Score Card */}
                <div className="flex gap-4">
                    <div className="bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                        <div className="text-3xl font-black text-emerald-600">{stats.free}</div>
                        <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Visa Free</div>
                    </div>
                    <div className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100">
                        <div className="text-3xl font-black text-amber-600">{stats.voa}</div>
                        <div className="text-xs font-bold text-amber-800 uppercase tracking-widest">On Arrival</div>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <Search className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search destination (e.g., Japan, France, US)..."
                        value={searchDest}
                        onChange={(e) => setSearchDest(e.target.value)}
                        className="flex-1 font-medium bg-transparent outline-none placeholder:text-slate-400"
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p>Analysing {selectedPassport} passport power...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                        {filteredDestinations.map(([code, data]) => (
                            <div key={code} className={`p-4 rounded-xl border ${getStatusColor(data.status)} flex flex-col items-center text-center gap-1 transition-transform hover:scale-105 hover:shadow-md cursor-default group`}>
                                <span className="text-3xl mb-2">{/* Flag emoji could go here if mapped */}</span>
                                <span className="text-lg font-bold leading-tight line-clamp-2 min-h-[3rem] flex items-center justify-center">
                                    {data.name}
                                </span>
                                <span className="text-xs font-medium text-slate-400 mb-2">{code}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider py-1 px-2 bg-white/50 rounded-lg w-full">
                                    {getStatusText(data.status)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
