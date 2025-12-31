'use client';

import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Configure marked
marked.setOptions({
    breaks: true,
    gfm: true
});

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export default function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
    if (!content) return null;

    const html = marked.parse(content) as string;

    return (
        <div
            className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
