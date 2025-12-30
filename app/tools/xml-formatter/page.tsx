import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import XmlTools from '@/components/tools/XmlTools';

export const metadata = genMeta({
    title: 'Free XML Formatter & Validator - Format XML Online',
    description: 'Format, validate, and minify XML online. Convert XML to JSON. Free XML formatter and validator tool with error detection.',
    keywords: ['xml formatter', 'xml validator', 'format xml', 'validate xml', 'xml to json'],
    canonical: '/tools/xml-formatter',
});

const relatedTools = [
    { name: 'JSON Validator', href: '/tools/json-validator' },
    { name: 'YAML Tools', href: '/tools/yaml-tools' },
    { name: 'Code Formatter', href: '/tools/code-formatter' },
];

export default function XmlFormatterPage() {
    return (
        <ToolLayout
            title="XML Formatter & Validator"
            description="Format, validate, minify, and convert XML documents. Find syntax errors with detailed error messages."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is XML?
                </h2>
                <p className="text-gray-600 mb-4">
                    XML (eXtensible Markup Language) is a markup language that defines rules for encoding documents in a format that is both human-readable and machine-readable. XML is widely used for data exchange between systems, configuration files, web services (SOAP), RSS feeds, and Android app development. Unlike HTML, XML is designed to store and transport data, not to display it.
                </p>
                <p className="text-gray-600">
                    Our XML tool provides comprehensive functionality including formatting with proper indentation, syntax validation with error detection, minification for production use, and conversion to JSON format. All processing happens client-side, ensuring your data remains private and secure.
                </p>
            </section>

            <XmlTools />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Common XML Use Cases
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Web Services & APIs:</strong> SOAP-based web services use XML for request/response messages between systems</li>
                    <li><strong>Configuration Files:</strong> Many applications and frameworks use XML for configuration (Maven pom.xml, Android layouts, Spring configs)</li>
                    <li><strong>Data Exchange:</strong> XML is a standard format for exchanging data between different systems and platforms</li>
                    <li><strong>Android Development:</strong> Android apps use XML for defining user interface layouts and resource configurations</li>
                    <li><strong>RSS/Atom Feeds:</strong> Content syndication feeds use XML to distribute blog posts and news articles</li>
                    <li><strong>SVG Graphics:</strong> Scalable Vector Graphics (SVG) files are XML-based vector image formats</li>
                    <li><strong>Office Documents:</strong> Modern Microsoft Office formats (docx, xlsx) are XML-based compressed archives</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
