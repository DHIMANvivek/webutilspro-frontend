'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface SearchableDropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export default function SearchableDropdown({
    options,
    value,
    onChange,
    placeholder = 'Search branches...',
    label = 'Select Branch'
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">{label}</p>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-2 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-900 transition-all focus:ring-2 focus:ring-blue-500/20 ${isOpen ? 'ring-2 ring-blue-500/20' : ''
                    }`}
            >
                <span className="truncate">{value}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    style={{ maxHeight: '320px' }}
                >
                    <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full"
                                >
                                    <X className="w-3 h-3 text-slate-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '240px' }}>
                        {filteredOptions.length > 0 ? (
                            <div className="p-1">
                                {filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(option)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${value === option
                                                ? 'bg-blue-50 text-blue-600 font-bold'
                                                : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="truncate">{option}</span>
                                        {value === option && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">No branches found matching "{search}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
