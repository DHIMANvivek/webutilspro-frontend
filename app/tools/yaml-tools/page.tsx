import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import YamlTools from '@/components/tools/YamlTools';

export const metadata = genMeta({
    title: 'Free YAML Tools - YAML to JSON Converter & Validator',
    description: 'Convert YAML to JSON and JSON to YAML. Validate and format YAML files online. Free YAML tools for developers.',
    keywords: ['yaml to json', 'json to yaml', 'yaml validator', 'yaml formatter', 'yaml converter'],
    canonical: '/tools/yaml-tools',
});

const relatedTools = [
    { name: 'JSON Validator', href: '/tools/json-validator' },
    { name: 'XML Formatter', href: '/tools/xml-formatter' },
    { name: 'JSON ↔ CSV', href: '/tools/json-to-csv' },
];

export default function YamlToolsPage() {
    return (
        <ToolLayout
            title="YAML Tools"
            description="Convert between YAML and JSON, validate YAML syntax, and format YAML files. Complete YAML toolkit for developers."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What is YAML?
                </h2>
                <p className="text-gray-600 mb-4">
                    YAML (YAML Ain't Markup Language) is a human-readable data serialization format commonly used for configuration files and data exchange. YAML is designed to be easy to read and write, using indentation and minimal syntax. It's particularly popular in DevOps tools like Docker, Kubernetes, Ansible, and CI/CD pipelines because of its clean, readable syntax that's less verbose than JSON or XML.
                </p>
                <p className="text-gray-600">
                    Our YAML tools provide comprehensive functionality including bidirectional conversion between YAML and JSON formats, syntax validation with error detection, automatic formatting with proper indentation, and a complete syntax guide. All processing is done client-side for maximum privacy and security.
                </p>
            </section>

            <YamlTools />

            <section className="card mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Where is YAML Used?
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Docker & Kubernetes:</strong> docker-compose.yml and Kubernetes manifests use YAML for container and deployment configurations</li>
                    <li><strong>CI/CD Pipelines:</strong> GitHub Actions, GitLab CI, CircleCI, and other CI/CD tools use YAML for workflow definitions</li>
                    <li><strong>Ansible Playbooks:</strong> Infrastructure as Code (IaC) automation uses YAML for defining server configurations and tasks</li>
                    <li><strong>Configuration Management:</strong> Application configs, especially in Python, Ruby, and Node.js projects use YAML files</li>
                    <li><strong>Swagger/OpenAPI:</strong> API documentation and specifications are often written in YAML format</li>
                    <li><strong>Cloud Platforms:</strong> AWS CloudFormation, Azure Resource Manager templates support YAML configurations</li>
                    <li><strong>Static Site Generators:</strong> Jekyll, Hugo, and other SSGs use YAML for front matter and configuration</li>
                </ul>
            </section>
        </ToolLayout>
    );
}
