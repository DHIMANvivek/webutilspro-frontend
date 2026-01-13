import type { Metadata } from 'next';
import ReadmeArchitect from '@/components/tools/ReadmeArchitect';


export const metadata: Metadata = {
    title: 'Readme.md Architect | GitHub Profile Generator',
    description: 'Create stunning GitHub Profile READMEs in seconds. Drag-and-drop builder with dynamic stats, skill icons, and more.',
    keywords: ['github readme generator', 'profile readme', 'developer branding', 'markdown builder'],
    openGraph: {
        title: 'Readme.md Architect - Build Your Developer Brand',
        description: 'The easiest way to create a professional GitHub profile README.',
        type: 'website',
    }
};

export default function ReadmeArchitectPage() {
    return (
        <ReadmeArchitect />
    );
}
