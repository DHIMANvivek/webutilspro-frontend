import SchemaForge from '@/components/tools/SchemaForge';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Schema-Forge | JSON to Fullstack Architect | WebUtilsPro',
    description: 'Transform raw JSON into production-ready software components. Generate TypeScript interfaces, Zod schemas, Database models, and Mock data in seconds.',
    keywords: ['JSON to Typescript', 'JSON to Zod', 'Database Schema Generator', 'Mock Data Generator', 'Prisma Mongoose Typescript', 'Developer Tools'],
    openGraph: {
        title: 'Schema-Forge - The Fullstack Architect',
        description: 'Forge your complete data layer from a single JSON response.',
        type: 'website',
    }
};

export default function SchemaForgePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <SchemaForge />
        </div>
    );
}
