import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MediaGenDashboard from '../../../components/admin/MediaGenDashboard';

export const metadata: Metadata = {
    title: 'Media Generation Dashboard | Admin',
    description: 'Internal tool for generating AI media for WebUtilsPro tools.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminMediaGenPage() {
    // SECURITY: Only allow access in local development
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }

    return <MediaGenDashboard />;
}
