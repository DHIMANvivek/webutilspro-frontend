'use client';

import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Clock, Calendar, Hash, Info, Check, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CronGeneratorClient() {
    const [cron, setCron] = useState('* * * * *');
    const [humanReadable, setHumanReadable] = useState('Every minute');
    const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

    // Independent state for selectors
    const [minute, setMinute] = useState('*');
    const [hour, setHour] = useState('*');
    const [dayMonth, setDayMonth] = useState('*');
    const [month, setMonth] = useState('*');
    const [dayWeek, setDayWeek] = useState('*');

    const updateCron = () => {
        const newCron = `${minute} ${hour} ${dayMonth} ${month} ${dayWeek}`;
        setCron(newCron);
        // Simple human readable parser logic (can be expanded)
        setHumanReadable(describeCron(newCron));
    };

    useEffect(() => {
        updateCron();
    }, [minute, hour, dayMonth, month, dayWeek]);

    const presets = [
        { label: 'Every Minute', value: '* * * * *' },
        { label: 'Every Hour', value: '0 * * * *' },
        { label: 'Every Day at Midnight', value: '0 0 * * *' },
        { label: 'Every Sunday', value: '0 0 * * 0' },
        { label: 'Every Month', value: '0 0 1 * *' },
    ];

    const applyPreset = (preset: string) => {
        const parts = preset.split(' ');
        if (parts.length === 5) {
            setMinute(parts[0]);
            setHour(parts[1]);
            setDayMonth(parts[2]);
            setMonth(parts[3]);
            setDayWeek(parts[4]);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cron);
        toast.success('Cron expression copied!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Output Display - The "Hero" of the tool */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Generated Schedule</h2>
                            <div className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight mb-2">
                                {cron}
                            </div>
                            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center md:justify-start gap-2">
                                <Clock className="w-5 h-5" />
                                {humanReadable}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/20"
                            >
                                <Copy className="w-5 h-5" />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Hash className="w-5 h-5 text-purple-500" />
                                Configuration
                            </h3>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('simple')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'simple' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Simple
                                </button>
                                <button
                                    onClick={() => setActiveTab('advanced')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'advanced' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Advanced
                                </button>
                            </div>
                        </div>

                        {/* Interactive Sliders/Selectors */}
                        <div className="space-y-6">
                            <CronSelector label="Minute" value={minute} onChange={setMinute} range="0-59" />
                            <CronSelector label="Hour" value={hour} onChange={setHour} range="0-23" />
                            <CronSelector label="Day of Month" value={dayMonth} onChange={setDayMonth} range="1-31" />
                            <CronSelector label="Month" value={month} onChange={setMonth} range="1-12" />
                            <CronSelector label="Day of Week" value={dayWeek} onChange={setDayWeek} range="0-6 (Sun-Sat)" />
                        </div>
                    </div>

                    {/* Next Runs Preview (Placeholder for logic) */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl p-6">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Example Schedules
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {presets.map((p) => (
                                <button
                                    key={p.label}
                                    onClick={() => applyPreset(p.value)}
                                    className="p-3 bg-white dark:bg-slate-800 rounded-xl text-left border border-blue-100 dark:border-slate-700 hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 group-hover:text-blue-500 transition-colors">{p.label}</div>
                                    <div className="font-mono text-xs text-slate-900 dark:text-slate-300">{p.value}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-slate-400" />
                            Quick Reference
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex gap-3">
                                <code className="bg-slate-200 dark:bg-slate-800 px-1.5 rounded font-bold">*</code>
                                <span>Any value</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="bg-slate-200 dark:bg-slate-800 px-1.5 rounded font-bold">,</code>
                                <span>Value list separator</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="bg-slate-200 dark:bg-slate-800 px-1.5 rounded font-bold">-</code>
                                <span>Range of values</span>
                            </li>
                            <li className="flex gap-3">
                                <code className="bg-slate-200 dark:bg-slate-800 px-1.5 rounded font-bold">/</code>
                                <span>Step values</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CronSelector({ label, value, onChange, range }: { label: string, value: string, onChange: (v: string) => void, range: string }) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-32">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                <span className="text-[10px] text-slate-400">{range}</span>
            </div>
            <div className="flex-1">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="flex gap-1">
                <button onClick={() => onChange('*')} className={`px-2 py-1 text-xs font-bold rounded border ${value === '*' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>*</button>
                <button onClick={() => onChange('0')} className="px-2 py-1 text-xs font-bold rounded border bg-white text-slate-500 border-slate-200 hover:bg-slate-50">0</button>
            </div>
        </div>
    );
}

// Simple description logic (placeholder for a real parser library if needed)
function describeCron(expression: string): string {
    const [min, hr, dom, mon, dow] = expression.split(' ');

    if (expression === '* * * * *') return 'At every minute';
    if (min === '0' && hr === '*' && dom === '*' && mon === '*' && dow === '*') return 'At minute 0 past every hour';
    if (min === '0' && hr === '0' && dom === '*' && mon === '*' && dow === '*') return 'At 00:00 every day';

    // Fallback manual description
    let desc = 'At ';
    if (min === '*') desc += 'every minute';
    else desc += `minute ${min}`;

    if (hr !== '*') desc += ` past hour ${hr}`;
    if (dom !== '*') desc += ` on day-of-month ${dom}`;
    if (mon !== '*') desc += ` in month ${mon}`;
    if (dow !== '*') desc += ` on day-of-week ${dow}`;

    return desc;
}
