import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import CronGeneratorClient from '@/components/tools/CronGenerator/CronGeneratorClient';
import ToolLayout from '@/components/ToolLayout';

export const metadata = genMeta({
    title: 'Visual Cron Job Generator | Crontab Schedule Helper',
    description: 'Create difficult cron schedules easily with our interactive visual generator. Convert cron expressions to human-readable text instantly.',
    keywords: [
        'cron job generator',
        'crontab visualizer',
        'cron schedule builder',
        'cron expression generator',
        'crontab guru alternative',
        'cron syntax helper'
    ],
    canonical: '/tools/cron-job-generator'
});

const jsonLd = generateToolSchema({
    name: 'Visual Cron Job Generator',
    description: 'Interactive visual builder for Cron schedules. Generates standard 5-part cron syntax.',
    url: 'https://webutilspro.com/tools/cron-job-generator'
});

export default function CronGeneratorPage() {
    return (
        <ToolLayout
            title="Visual Cron Generator"
            description="Build complex schedules visually and get instant standard cron expressions without memorizing syntax."
            schema={jsonLd}
            relatedTools={[
                { name: 'Timestamp Converter', href: '/tools/timestamp-converter' },
                { name: 'Text Tools', href: '/tools/text-tools' },
                { name: 'API Playground', href: '/tools/api-playground' }
            ]}
        >
            <CronGeneratorClient />

            {/* FAQ / Content for SEO */}
            <section className="mt-10 border border-neutral-900/15 bg-[#fbfbf4] p-6">
                <div className="wup-prose">
                    <h2>Understanding Cron Expressions</h2>
                    <p>
                        A standard Cron expression consists of 5 fields separated by spaces:
                    </p>
                    <div className="mt-4 overflow-x-auto border border-neutral-900/15 bg-[#fffefa] p-4 font-mono text-sm text-neutral-950">
                        <pre>{`
  ┌───────────── minute (0 - 59)
  │ ┌───────────── hour (0 - 23)
  │ │ ┌───────────── day of the month (1 - 31)
  │ │ │ ┌───────────── month (1 - 12)
  │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
  │ │ │ │ │
  * * * * *
                        `}</pre>
                    </div>
                </div>
            </section>
        </ToolLayout>
    );
}
