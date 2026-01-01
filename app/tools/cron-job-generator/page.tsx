import { generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';
import CronGeneratorClient from '@/components/tools/CronGenerator/CronGeneratorClient';

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
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
            <div className="container mx-auto px-4 py-12">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Visual <span className="text-blue-600">Cron Generator</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Stop memorizing <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm">* * * * *</code> syntax.
                        Build complex schedules visually and get instant standard cron expressions.
                    </p>
                </div>

                <CronGeneratorClient />

                {/* FAQ / Content for SEO */}
                <div className="max-w-3xl mx-auto mt-20 prose dark:prose-invert">
                    <h2>Understanding Cron Expressions</h2>
                    <p>
                        A standard Cron expression consists of 5 fields separated by spaces:
                    </p>
                    <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm shadow-lg overflow-x-auto">
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
            </div>
        </div>
    );
}
