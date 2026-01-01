'use client';

import { useState } from 'react';
import { Upload, FileText, Image, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PDFExtractorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
            setExtractedText('');
        } else {
            toast.error('Please select a valid PDF file');
        }
    };

    const handleExtract = async () => {
        if (!file) {
            toast.error('Please select a PDF file first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/extract-pdf', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to extract text');
            }

            // Extract only the markdown content from the response
            const markdownText = data.text || data.markdown || '';
            setExtractedText(markdownText);
            toast.success('Text extracted successfully!');
        } catch (err: any) {
            setError(err.message || 'An error occurred during extraction');
            toast.error(err.message || 'Failed to extract text');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!extractedText) return;

        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file?.name.replace('.pdf', '')}_extracted.txt` || 'extracted-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Text downloaded!');
    };

    const handleCopy = () => {
        if (!extractedText) return;
        navigator.clipboard.writeText(extractedText);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen gradient-bg py-12">
            <div className="container-custom max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        AI-Powered PDF Text Extractor
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Extract text from complex PDFs containing images, tables, and mixed content using advanced AI
                    </p>
                    <button
                        onClick={() => {
                            document.getElementById('upload-section')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        USE PDF EXTRACTOR
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                </div>

                {/* Capability Diagram */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 =text-center">
                        What Our Tool Can Do
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Input */}
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Complex PDF Input</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>📄 Scanned documents</li>
                                    <li>🖼️ Images & graphics</li>
                                    <li>📊 Tables & charts</li>
                                    <li>📝 Mixed layouts</li>
                                </ul>
                            </div>
                        </div>

                        {/* Processing */}
                        <div className="text-center flex items-center justify-center">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">AI Processing</h3>
                                <p className="text-sm text-gray-600">
                                    LlamaIndex AI analyzes and extracts text with high accuracy
                                </p>
                            </div>
                        </div>

                        {/* Output */}
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-4">
                                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Clean Text Output</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>✅ Formatted text</li>
                                    <li>✅ Preserved structure</li>
                                    <li>✅ Image text extracted</li>
                                    <li>✅ Export to TXT</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Flow Arrow */}
                    <div className="mt-6 text-center text-gray-400 text-sm font-medium">
                        Upload → AI Analysis → Download
                    </div>
                </div>

                {/* Main Tool */}
                <div id="upload-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload PDF</h2>

                        {/* File Upload */}
                        <div className="mb-6">
                            <label
                                htmlFor="pdf-upload"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors bg-gray-50 hover:bg-gray-100"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF files only (MAX. 10MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="pdf-upload"
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Extract Button */}
                        <button
                            onClick={handleExtract}
                            disabled={!file || loading}
                            className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Extracting...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    Extract Text
                                </>
                            )}
                        </button>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Extracted Text</h2>
                            {extractedText && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="btn-secondary px-3 py-1.5 text-sm rounded flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="btn-primary px-3 py-1.5 text-sm rounded flex items-center gap-1"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Text Display */}
                        <div className="relative">
                            {extractedText ? (
                                <div className="w-full min-h-96 max-h-[600px] overflow-y-auto p-6 border border-gray-300 rounded-lg bg-white prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {extractedText}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div className="w-full h-96 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                                    {!loading && (
                                        <div className="text-center text-gray-400">
                                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No text extracted yet</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Character Count */}
                        {extractedText && (
                            <p className="mt-3 text-sm text-gray-500">
                                {extractedText.length} characters | {extractedText.split(/\s+/).filter(Boolean).length} words
                            </p>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { icon: '🤖', title: 'AI-Powered', desc: 'Uses LlamaIndex for accurate extraction' },
                        { icon: '🖼️', title: 'OCR Support', desc: 'Extracts text from images in PDFs' },
                        { icon: '⚡', title: 'Fast Processing', desc: 'Quick extraction even for large files' },
                        { icon: '🔒', title: 'Secure', desc: 'Files processed securely, not stored' },
                    ].map((feature, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* What is This Tool Section */}
                <section className="card mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        What is the PDF Text Extractor?
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p>
                            The <strong>AI-Powered PDF Text Extractor</strong> is an advanced tool that uses LlamaIndex AI technology to extract text from complex PDF documents. Unlike traditional PDF readers that struggle with scanned documents or PDFs containing images, our tool can intelligently process and extract text from any type of PDF content.
                        </p>
                        <p>
                            Whether you're dealing with scanned documents, PDFs with embedded images, complex layouts with tables and charts, or mixed content, our AI-powered extractor can accurately identify and extract all text content. The tool preserves formatting, structure, and even extracts text from images using advanced OCR (Optical Character Recognition) capabilities.
                        </p>
                        <p>
                            Perfect for researchers, students, legal professionals, and anyone who needs to convert PDF content into editable, searchable text. The extracted text is rendered in beautifully formatted markdown, making it easy to read, copy, or export for further use.
                        </p>
                    </div>
                </section>

                {/* How to Use Section */}
                <section className="card mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        How to Use the PDF Text Extractor
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <ol className="list-decimal pl-6 space-y-3">
                            <li>
                                <strong>Upload Your PDF:</strong> Click the upload area or drag and drop your PDF file. The file must be under 10MB for optimal performance.
                            </li>
                            <li>
                                <strong>Start Extraction:</strong> Click the "Extract Text" button. Our AI will begin processing your PDF, which may take up to 60 seconds depending on file complexity.
                            </li>
                            <li>
                                <strong>View Results:</strong> Once processing is complete, the extracted text will appear as beautifully rendered markdown with proper formatting, headings, and structure preserved.
                            </li>
                            <li>
                                <strong>Copy or Download:</strong> Use the "Copy" button to copy the text to your clipboard, or click "Download" to save the extracted text as a TXT file.
                            </li>
                            <li>
                                <strong>Process Another PDF:</strong> Simply upload a new file to extract text from additional documents.
                            </li>
                        </ol>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="card mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">📄 Scanned Documents</h3>
                            <p className="text-sm text-gray-600">
                                Extract text from scanned contracts, invoices, receipts, and official documents with high accuracy.
                            </p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">📚 Academic Papers</h3>
                            <p className="text-sm text-gray-600">
                                Convert research papers, textbooks, and academic PDFs into editable text for note-taking or analysis.
                            </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">📊 Reports & Presentations</h3>
                            <p className="text-sm text-gray-600">
                                Extract content from business reports, presentations, and data sheets containing tables and charts.
                            </p>
                        </div>
                        <div className="border-l-4 border-pink-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">⚖️ Legal Documents</h3>
                            <p className="text-sm text-gray-600">
                                Process legal contracts, court documents, and case files to make them searchable and editable.
                            </p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">🖼️ Image-Heavy PDFs</h3>
                            <p className="text-sm text-gray-600">
                                Extract text from PDFs with embedded images, diagrams, and infographics using AI-powered OCR.
                            </p>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">📧 Email Attachments</h3>
                            <p className="text-sm text-gray-600">
                                Quickly extract and process content from PDF attachments for archiving or reference.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="card mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What types of PDFs can this tool process?
                            </h3>
                            <p className="text-gray-600">
                                Our AI-powered extractor can process all types of PDFs including: text-based PDFs, scanned documents, PDFs with embedded images, complex layouts with tables and charts, mixed content PDFs, and even password-protected PDFs (if you have access). The maximum file size is 10MB.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                How accurate is the text extraction?
                            </h3>
                            <p className="text-gray-600">
                                Using LlamaIndex's advanced AI technology, our tool achieves very high accuracy rates, typically 95-99% for clear documents. The accuracy depends on the quality of the original PDF - high-resolution scans and well-formatted documents yield the best results. The tool also preserves formatting and structure, making the extracted text more usable.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Is my PDF data secure and private?
                            </h3>
                            <p className="text-gray-600">
                                Yes! Your PDFs are processed securely through our encrypted connection to LlamaIndex's servers. Files are only used for text extraction and are not permanently stored. Once extraction is complete, the data is discarded. We recommend not uploading sensitive documents containing personal information unless absolutely necessary.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Why does extraction take up to 60 seconds?
                            </h3>
                            <p className="text-gray-600">
                                The AI needs time to analyze each page, identify text regions (including within images), perform OCR where needed, and reconstruct the document structure. Complex PDFs with many images, tables, or poor scan quality may take longer. Most standard documents complete in 10-30 seconds.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-6 last:border-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can I extract text from images inside PDFs?
                            </h3>
                            <p className="text-gray-600">
                                Absolutely! One of the key features of our AI-powered extractor is its ability to perform OCR (Optical Character Recognition) on images within PDFs. If your PDF contains screenshots, diagrams with text, or embedded images, the AI will extract any readable text from those images as well.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="card mt-8 bg-blue-50 border-blue-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Best Results</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Use high-quality scans:</strong> For scanned documents, ensure the scan resolution is at least 300 DPI for optimal OCR accuracy.</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Keep files under 10MB:</strong> Split large PDFs into smaller sections for faster processing and better results.</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Review the output:</strong> While accuracy is high, always review the extracted text for any OCR errors, especially with handwritten content or poor quality scans.</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Use markdown viewer:</strong> The extracted text is displayed in formatted markdown - take advantage of the rendered view for easier reading.</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
