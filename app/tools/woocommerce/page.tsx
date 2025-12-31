import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import WooCommerceClient from './WooCommerceClient';

export const metadata = genMeta({
    title: 'WooCommerce Store Manager - Securely Manage Products & Orders',
    description: 'Connect your WooCommerce store to WebUtilsPro for secure product management, order tracking, and AI-powered insights. No API keys stored, completely session-based.',
    keywords: ['woocommerce manager', 'store management', 'woocommerce api client', 'manage woocommerce orders', 'ai woocommerce assistant'],
    canonical: '/tools/woocommerce',
});

const relatedTools = [
    { name: 'MCP Tool Tester', href: '/tools/mcp-tester' },
    { name: 'JSON ↔ CSV Converter', href: '/tools/json-to-csv' },
    { name: 'AI Error Explainer', href: '/tools/ai-error-explainer' },
];

const faqs = [
    {
        question: 'Is it safe to connect my WooCommerce store?',
        answer: 'Yes, WebUtilsPro uses a secure, session-based approach. Your API keys are encrypted and stored only in your server-side session, never in a database. They expire automatically after inactivity.',
    },
    {
        question: 'What can I do with the WooCommerce Manager?',
        answer: 'You can view, edit, and manage products, track orders, and interact with your store data using our integrated AI assistant for rapid insights.',
    },
];

export default function WooCommercePage() {
    const toolSchema = generateToolSchema({
        name: 'WooCommerce Manager',
        description: 'Securely manage your WooCommerce store with AI-powered tools.',
        url: '/tools/woocommerce',
    });

    const faqSchema = generateFAQSchema(faqs);

    return (
        <ToolLayout
            title="WooCommerce Manager"
            description="Securely connect and manage your WooCommerce store. Effortlessly handle products, orders, and gain AI-powered insights into your business."
            relatedTools={relatedTools}
            schema={[toolSchema, faqSchema]}
        >
            <WooCommerceClient />
        </ToolLayout>
    );
}
