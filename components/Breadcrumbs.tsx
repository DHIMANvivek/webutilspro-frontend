import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="mb-8 animate-fade-in relative z-10">
            <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        <span>Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                        {index === items.length - 1 ? (
                            <span className="text-slate-900 dark:text-slate-100 font-semibold">{item.name}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
