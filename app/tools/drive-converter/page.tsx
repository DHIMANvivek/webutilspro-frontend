import type { Metadata } from 'next';
import DriveConverter from './DriveConverter';

export const metadata: Metadata = {
    title: 'Drive Uploader | Upload directly to Google Drive',
    description: 'Upload PDF, Word, Excel, and other files directly to your Google Drive and get shareable links instantly.',
};

export default function DriveConverterPage() {
    return <DriveConverter />;
}
