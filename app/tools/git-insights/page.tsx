import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import GitInsightsClient from './GitInsightsClient';

export const metadata = genMeta({
    title: 'Git Insights - Analyze GitHub Repositories',
    description: 'Visualize commit history, analyze code quality, track team productivity, and gain insights from your GitHub repositories with our free analytics tool.',
    keywords: ['git insights', 'github analytics', 'commit analysis', 'code quality', 'git visualization', 'repository analytics', 'developer productivity'],
    canonical: '/tools/git-insights',
});

const relatedTools = [
    { name: 'MCP Tool Tester', href: '/tools/mcp-tester' },
    { name: 'API Playground', href: '/tools/api-playground' },
    { name: 'Database Architect', href: '/tools/database-architect' },
];

const faqs = [
    {
        question: 'What is Git Insights?',
        answer: 'Git Insights is a free tool that analyzes your GitHub repositories to provide commit quality scores, PR metrics, branch health, and team productivity insights. It uses rule-based analysis (no AI costs) to help you maintain code quality.',
    },
    {
        question: 'Is my GitHub data secure?',
        answer: 'Yes! We use GitHub OAuth for authentication, and your access token is securely stored in an encrypted session. We never store your code or expose your token to the frontend. All data is cached temporarily to improve performance.',
    },
    {
        question: 'How does commit quality scoring work?',
        answer: 'Our rule-based algorithm analyzes commit messages for best practices like Conventional Commits format, optimal length, proper capitalization, and descriptive content. Scores range from 0-100 based on multiple quality factors.',
    },
    {
        question: 'Does this tool cost anything?',
        answer: 'No! Git Insights is completely free for both you and us. It uses GitHub\'s free API (5,000 requests/hour per user) and intelligent caching to provide fast analytics without any costs.',
    },
];

export default function GitInsightsPage() {
    const toolSchema = generateToolSchema({
        name: 'Git Insights',
        description: 'Analyze GitHub repositories with visual commit graphs, quality metrics, and team insights.',
        url: '/tools/git-insights',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="Git Insights"
            description="Analyze GitHub repositories with visual commit graphs, quality metrics, and team productivity insights. 100% free, powered by intelligent caching."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            <GitInsightsClient />
        </ToolLayout>
    );
}
