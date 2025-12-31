'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
    'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
    'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum'
];

type GenerateType = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsumGenerator() {
    const [type, setType] = useState<GenerateType>('paragraphs');
    const [count, setCount] = useState(3);
    const [generated, setGenerated] = useState('');
    const [startWith, setStartWith] = useState(true);

    const getRandomWord = () => {
        return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    };

    const generateSentence = () => {
        const length = Math.floor(Math.random() * 10) + 5; // 5-15 words
        const words = Array.from({ length }, () => getRandomWord());
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(' ') + '.';
    };

    const generateParagraph = () => {
        const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences
        const sentences = Array.from({ length: sentenceCount }, () => generateSentence());
        return sentences.join(' ');
    };

    const generate = () => {
        let result = '';

        if (type === 'words') {
            const words = Array.from({ length: count }, () => getRandomWord());
            if (startWith) {
                words[0] = 'Lorem';
                words[1] = 'ipsum';
            }
            result = words.join(' ');
        } else if (type === 'sentences') {
            const sentences = Array.from({ length: count }, () => generateSentence());
            if (startWith) {
                sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            }
            result = sentences.join(' ');
        } else {
            const paragraphs = Array.from({ length: count }, () => generateParagraph());
            if (startWith) {
                paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + paragraphs[0].split('. ').slice(1).join('. ');
            }
            result = paragraphs.join('\n\n');
        }

        setGenerated(result);
        toast.success(`Generated ${count} ${type}!`);
    };

    const copyText = () => {
        navigator.clipboard.writeText(generated);
        toast.success('Lorem ipsum copied!');
    };

    return (
        <div className="space-y-4">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lorem Ipsum Generator</h2>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Generate
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as GenerateType)}
                            className="input-field"
                        >
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
                            Count: {count}
                        </label>
                        <input
                            type="range"
                            id="count"
                            min="1"
                            max={type === 'paragraphs' ? 10 : type === 'sentences' ? 20 : 100}
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1</span>
                            <span>{type === 'paragraphs' ? 10 : type === 'sentences' ? 20 : 100}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={startWith}
                            onChange={(e) => setStartWith(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Start with "Lorem ipsum..."</span>
                    </label>
                </div>

                {/* Generate Button */}
                <button onClick={generate} className="btn-primary w-full md:w-auto mb-4">
                    📝 Generate Lorem Ipsum
                </button>

                {/* Results */}
                {generated && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Generated Text</h3>
                            <button onClick={copyText} className="btn-secondary text-sm">
                                📋 Copy
                            </button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap font-serif text-gray-700 leading-relaxed max-h-96 overflow-y-auto">
                            {generated}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            {generated.split(' ').length} words • {generated.length} characters
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">What is Lorem Ipsum?</h3>
                    <p className="text-gray-600">
                        Lorem Ipsum is placeholder text used in publishing and graphic design to demonstrate visual form without meaningful content.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Uses</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Website mockups</li>
                        <li>• Design prototypes</li>
                        <li>• Print layouts</li>
                        <li>• Content templates</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">History</h3>
                    <p className="text-gray-600">
                        Derived from Latin text by Cicero in 45 BC, Lorem Ipsum has been the industry standard since the 1500s.
                    </p>
                </div>
            </div>
        </div>
    );
}
