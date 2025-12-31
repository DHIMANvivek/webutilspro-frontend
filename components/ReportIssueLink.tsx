'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const REPO_URL = 'https://github.com/DHIMANvivek/webutilspro-issues/issues/new';

export function getIssueUrl(context?: string) {
    if (typeof window === 'undefined') return REPO_URL;

    // Clean up title: "Regex Tester | WebUtilsPro" -> "Regex Tester"
    const pageTitle = document.title.split('|')[0].trim();
    const isToolPage = window.location.pathname.startsWith('/tools/');
    const toolName = isToolPage ? pageTitle : null;

    const issueTitle = toolName
        ? `Issue in ${toolName}`
        : `Issue on ${window.location.pathname === '/' ? 'Home' : pageTitle}`;

    const title = encodeURIComponent(issueTitle);
    const body = encodeURIComponent(
        `## Description\n[Please describe the issue you encountered]\n\n` +
        `## Context\n` +
        `- **Location**: ${toolName ? toolName : 'Global'}\n` +
        `- **Page URL**: ${window.location.href}\n` +
        `- **Title**: ${document.title}\n` +
        (context ? `- **Additional Info**: ${context}\n` : '') +
        `\n---\n*Reported via WebUtilsPro Runtime Feedback*`
    );

    return `${REPO_URL}?title=${title}&body=${body}`;
}

interface ReportIssueLinkProps {
    children: React.ReactNode;
    className?: string;
    context?: string;
}

export default function ReportIssueLink({ children, className, context }: ReportIssueLinkProps) {
    const [url, setUrl] = useState(REPO_URL);
    const pathname = usePathname();
    const isToolPage = pathname?.startsWith('/tools/');

    useEffect(() => {
        setUrl(getIssueUrl(context));
    }, [context, pathname]);

    if (!isToolPage) {
        return (
            <span className={className} style={{ display: 'none' }}>
                {children}
            </span>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            {children}
        </a>
    );
}
