import type { Metadata } from 'next';
import CloudLabClient from '@/components/tools/CloudLab/CloudLabClient';

export const metadata: Metadata = {
    title: 'Cloud Lab - Managed AWS Workflow Testing by WebUtilsPro',
    description: 'Test AWS-style S3, SQS, SNS, Lambda, DynamoDB, API Gateway, and webhook flows in managed WebUtilsPro Cloud Lab sessions.',
    alternates: {
        canonical: '/tools/cloud-lab'
    }
};

export default function CloudLabPage() {
    return <CloudLabClient />;
}
