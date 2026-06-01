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
        <nav className="relative z-10 mb-8">
            <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 md:pb-0">
                <li className="flex items-center">
                    <Link href="/" className="flex items-center gap-1 transition-colors hover:text-neutral-950">
                        <Home className="h-3.5 w-3.5" />
                        <span>Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                        {index === items.length - 1 ? (
                            <span className="font-bold text-neutral-950">{item.name}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="flex items-center gap-1 transition-colors hover:text-neutral-950"
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
