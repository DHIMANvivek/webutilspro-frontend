import { generateMetadata as genMeta } from '@/lib/seo';
import ToolLayout from '@/components/ToolLayout';
import PasswordGenerator from '@/components/tools/PasswordGenerator';

export const metadata = genMeta({
    title: 'Free Password Generator & Strength Checker - Secure Passwords',
    description: 'Generate strong, secure passwords and check password strength. Customizable length, character types, and instant strength analysis. Free online password tool.',
    keywords: ['password generator', 'secure password', 'password strength', 'random password', 'strong password generator'],
    canonical: '/tools/password-generator',
});

const relatedTools = [
    { name: 'JWT Decoder', href: '/tools/jwt-decoder' },
    { name: 'Base64 Encoder/Decoder', href: '/tools/base64' },
    { name: 'Hash Generator', href: '/tools/jwt-decoder' },
];

export default function PasswordGeneratorPage() {
    return (
        <ToolLayout
            title="Password Generator & Strength Checker"
            description="Generate cryptographically secure passwords and analyze password strength with our free online tool."
            relatedTools={relatedTools}
        >
            <section className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Why Use a Password Generator?
                </h2>
                <p className="text-gray-600 mb-4">
                    Strong passwords are your first line of defense against unauthorized access to your accounts. Our Password Generator creates cryptographically random passwords with customizable length and character types, ensuring maximum security for your online accounts.
                </p>
                <p className="text-gray-600">
                    The built-in Password Strength Checker analyzes your passwords in real-time, evaluating length, character variety, and complexity to give you instant feedback. All password generation and analysis happens locally in your browser - we never see or store your passwords, ensuring complete privacy and security.
                </p>
            </section>

            <PasswordGenerator />
        </ToolLayout>
    );
}
