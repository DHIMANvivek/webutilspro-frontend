'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    id?: string;
    className?: string;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    label,
    id,
    className = '',
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div
                id={id}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl bg-white text-gray-900 shadow-sm transition-all duration-300 cursor-pointer hover:border-blue-500/50 ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-md' : ''}`}
            >
                <span className="block truncate">{selectedOption?.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200 origin-top">
                    <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar focus:outline-none">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                role="option"
                                aria-selected={value === option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-all duration-200 mx-2 rounded-xl ${value === option.value
                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                            >
                                <span className="block truncate">{option.label}</span>
                                {value === option.value && (
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white">
                                        <Check className="w-3 h-3" strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
