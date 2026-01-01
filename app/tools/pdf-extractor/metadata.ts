import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
    title: 'PDF Text Extractor - AI-Powered OCR Tool',
    description:
        'Extract text from complex PDFs containing images, tables, and mixed content. Powered by LlamaIndex AI for accurate OCR and text extraction.',
    keywords: [
        'pdf text extractor',
        'pdf to text',
        'ocr pdf',
        'extract text from pdf',
        'pdf converter',
        'ai pdf extractor',
        'llamaindex',
        'pdf with images',
    ],
});

export { default } from './PDFExtractor';
