import WebhookInspector from '@/components/tools/WebhookInspector';

export const metadata = {
    title: 'Webhook Inspector | WebUtilsPro',
    description: 'Capture and inspect incoming webhook requests in real-time.',
};

export default function WebhookInspectorPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <WebhookInspector />
        </div>
    );
}
