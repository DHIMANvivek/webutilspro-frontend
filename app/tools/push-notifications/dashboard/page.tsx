import type { Metadata } from 'next';
import PushNotificationDashboard from '@/components/tools/PushNotifications/PushNotificationDashboard';

export const metadata: Metadata = {
    title: 'Push Notification Dashboard - WebUtilsPro',
    description: 'Manage your web push notifications, send campaigns, and track analytics.',
};

export default function DashboardPage() {
    return <PushNotificationDashboard />;
}
