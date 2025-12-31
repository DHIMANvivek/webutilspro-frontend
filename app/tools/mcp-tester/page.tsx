import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import MCPTesterClient from './MCPTesterClient';

export const metadata = genMeta({
    title: 'MCP Tool Tester - Test Model Context Protocol Servers',
    description: 'The ultimate sandbox for testing Model Context Protocol (MCP) servers. Connect, discover capabilities, and interact with tools using AI. Support for npm, npx, and custom environment variables.',
    keywords: ['mcp tester', 'model context protocol', 'mcp tool', 'ai debug tool', 'mcp server test', 'anthropic mcp'],
    canonical: '/tools/mcp-tester',
});

const relatedTools = [
    { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' },
    { name: 'Prompt Optimizer', href: '/tools/prompt-optimizer' },
    { name: 'WooCommerce Manager', href: '/tools/woocommerce' },
];

const faqs = [
    {
        question: 'What is the MCP Tool Tester?',
        answer: 'The MCP Tool Tester is a developer tool designed to connect to and interact with Model Context Protocol (MCP) servers. It allows you to discover tools, resources, and prompts exposed by a server and test its functionality through an AI chat interface.',
    },
    {
        question: 'How do I connect to a local MCP server?',
        answer: 'You can use the "Manual Configuration" form to specify the command (like npx), arguments, and any necessary environment variables. Once connected, WebUtilsPro will automatically discover the server\'s capabilities.',
    },
    {
        question: 'Is my MCP connection secure?',
        answer: 'Yes, your connection details and environment variables are processed on the server-side and never exposed to the frontend. We use standard process pipes for communication with your local MCP servers.',
    },
];

export default function MCPTesterPage() {
    const toolSchema = generateToolSchema({
        name: 'MCP Tool Tester',
        description: 'Test and interact with Model Context Protocol (MCP) servers in a secure sandbox.',
        url: '/tools/mcp-tester',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="MCP Tool Tester"
            description="Test and interact with any Model Context Protocol (MCP) server. Discover tools, resources, and test functionality with our integrated AI assistant."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            <MCPTesterClient />
        </ToolLayout>
    );
}
