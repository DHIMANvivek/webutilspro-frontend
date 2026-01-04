'use client';

import React, { useState } from 'react';
import { Search, Globe, TrendingDown, DollarSign, Loader2, Gamepad2, AlertCircle } from 'lucide-react';

interface GameResult {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface RegionPrice {
    code: string;
    currency: string;
    name: string;
    flag: string;
    localPrice: number;
    localCurrency: string;
    usdPrice: number;
    discount: number;
}

export default function SteamPricingClient() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<GameResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);
    const [prices, setPrices] = useState<RegionPrice[]>([]);
    const [isLoadingPrices, setIsLoadingPrices] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Actions ---
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setSearchResults([]);
        setError(null);
        setSelectedGame(null);
        setPrices([]);

        try {
            const res = await fetch(`/api/steam/search?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            setError('Failed to find games. Steam might be rate-limiting us.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectGame = async (game: GameResult) => {
        setSelectedGame(game);
        setSearchResults([]);
        setIsLoadingPrices(true);

        try {
            const res = await fetch(`/api/steam/prices?id=${game.id}`);
            if (!res.ok) throw new Error('Failed to fetch prices');
            const data = await res.json();
            setPrices(data);
        } catch (err) {
            setError('Could not retrieve global pricing data.');
        } finally {
            setIsLoadingPrices(false);
        }
    };

    // --- Helpers ---
    const getPriceColor = (usdPrice: number, allPrices: RegionPrice[]) => {
        if (!allPrices.length) return 'bg-slate-100';
        const max = Math.max(...allPrices.map(p => p.usdPrice));
        const min = Math.min(...allPrices.map(p => p.usdPrice));

        if (usdPrice === min) return 'bg-emerald-500 text-white'; // Cheapest
        if (usdPrice === max) return 'bg-red-500 text-white'; // Most Expensive
        return 'bg-slate-200 text-slate-700';
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Search Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
                <form onSubmit={handleSearch} className="relative flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search Steam games (e.g. 'Cyberpunk 2077', 'Elden Ring')..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                        Search
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {/* Search Results List */}
                {searchResults.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2">
                        {searchResults.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => handleSelectGame(game)}
                                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group border border-transparent hover:border-slate-200"
                            >
                                <img src={game.image} alt={game.name} className="w-16 h-8 object-cover rounded shadow-sm" />
                                <span className="font-bold text-slate-700 group-hover:text-blue-600 flex-1">{game.name}</span>
                                <span className="text-sm font-mono text-slate-400 hidden sm:block">ID: {game.id}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Analysis Section */}
            {selectedGame && (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
                    {/* Header Card */}
                    <div className="flex items-start gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
                        <img src={selectedGame.image.replace('capsule_sm', 'header')} alt={selectedGame.name} className="w-48 rounded-lg shadow-md z-10 hidden sm:block" />
                        <div className="flex-1 z-10">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                                <Gamepad2 size={14} /> Global Price Analysis
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedGame.name}</h2>
                            <p className="text-slate-500 text-sm">Comparing purchasing power parity across 30+ global regions.</p>
                        </div>
                    </div>

                    {isLoadingPrices ? (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-400 animate-pulse">
                            <Globe size={48} className="mb-4 text-slate-200" />
                            <p className="font-medium">Scanning global Steam endpoints...</p>
                        </div>
                    ) : (
                        prices.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* Best Deal Banner */}
                                <div className="bg-emerald-500 text-white p-4 flex items-center justify-center gap-3">
                                    <TrendingDown size={20} className="fill-white/20" />
                                    <span className="font-bold">
                                        Cheapest Region: {prices[0].name} ({prices[0].flag}) at ${prices[0].usdPrice.toFixed(2)}
                                    </span>
                                </div>

                                <div className="p-8">
                                    <div className="space-y-4">
                                        {prices.map((region, index) => {
                                            const percentage = (region.usdPrice / Math.max(...prices.map(p => p.usdPrice))) * 100;

                                            return (
                                                <div key={region.code} className="group relative">
                                                    <div className="flex items-center gap-4 mb-1 relative z-10">
                                                        <div className="w-8 text-2xl text-center">{region.flag}</div>
                                                        <div className="w-24 font-bold text-slate-700 text-sm">{region.name}</div>

                                                        {/* Bar Chart */}
                                                        <div className="flex-1 h-10 bg-slate-50 rounded-lg overflow-hidden relative flex items-center px-3">
                                                            <div
                                                                className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-r-lg ${getPriceColor(region.usdPrice, prices)} opacity-20`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                            <div
                                                                className={`absolute top-0 left-0 h-full w-1 transition-all duration-1000 ${getPriceColor(region.usdPrice, prices)}`}
                                                            ></div>

                                                            <div className="relative flex justify-between w-full text-sm font-bold">
                                                                <span className="text-slate-900">${region.usdPrice.toFixed(2)}</span>
                                                                <span className="text-slate-400 font-mono text-xs font-normal">
                                                                    {region.localPrice} {region.localCurrency}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
