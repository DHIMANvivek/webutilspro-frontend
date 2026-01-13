import type { Metadata } from 'next';
import DriveConverter from './DriveConverter';

export const metadata: Metadata = {
    title: 'Universal Drive Converter | Convert PDF, Word, Excel to Google Docs',
    description: 'Convert PDF, Word, Excel, PowerPoint, and other files directly to Google Docs, Sheets, and Slides. Free online file converter tool.',
};

export default function DriveConverterPage() {
    return <DriveConverter />;
}
