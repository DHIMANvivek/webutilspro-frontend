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
    const [requirements, setRequirements] = useState<Record<string, string>>({});
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

        const free = Object.values(requirements).filter(s => s === 'visa-free').length;
        const voa = Object.values(requirements).filter(s => s === 'visa-on-arrival').length;
        const required = Object.values(requirements).filter(s => s === 'visa-required').length;

        return { free, voa, required, score: free + voa };
    }, [requirements]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'visa-free': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'visa-on-arrival': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'visa-required': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusText = (status: string) => {
        return status.replace(/-/g, ' ').toUpperCase();
    };

    // Filtered list for search
    const filteredDestinations = Object.entries(requirements).filter(([code, status]) => {
        return code.toLowerCase().includes(searchDest.toLowerCase());
        // Note: Real app would need a Country Code -> Name map (e.g. "IN" -> "India")
        // For now we display codes, we can add a simple map later.
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

            {/* List View (Placeholder for Map) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <Search className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search destination (e.g., JP, FR, US)..."
                        value={searchDest}
                        onChange={(e) => setSearchDest(e.target.value)}
                        className="flex-1 font-medium bg-transparent outline-none placeholder:text-slate-400"
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p>Analyzing global visa treaties...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                        {filteredDestinations.map(([code, status]) => (
                            <div key={code} className={`p-4 rounded-xl border ${getStatusColor(status)} flex flex-col items-center text-center gap-2 transition-transform hover:scale-105`}>
                                <span className="text-2xl font-bold">{code}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider">{getStatusText(status)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
