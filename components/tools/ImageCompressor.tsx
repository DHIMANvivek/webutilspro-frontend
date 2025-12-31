'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import CustomSelect from '@/components/ui/CustomSelect';

interface CompressedImage {
    original: File;
    compressed: Blob;
    originalSize: number;
    compressedSize: number;
    reduction: number;
    preview: string;
}

export default function ImageCompressor() {
    const [images, setImages] = useState<CompressedImage[]>([]);
    const [quality, setQuality] = useState(80);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState(0);

    const maxWidthOptions = [
        { value: '640', label: '640px (Mobile)' },
        { value: '1280', label: '1280px (HD)' },
        { value: '1920', label: '1920px (Full HD)' },
        { value: '3840', label: '3840px (4K)' },
        { value: '10000', label: 'Original size' },
    ];

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsCompressing(true);
        setProgress(0);

        const compressedImages: CompressedImage[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: maxWidth,
                    useWebWorker: true,
                    quality: quality / 100,
                };

                const compressedBlob = await imageCompression(file, options);
                const originalSize = file.size;
                const compressedSize = compressedBlob.size;
                const reduction = ((1 - compressedSize / originalSize) * 100);

                // Create preview
                const preview = URL.createObjectURL(compressedBlob);

                compressedImages.push({
                    original: file,
                    compressed: compressedBlob,
                    originalSize,
                    compressedSize,
                    reduction,
                    preview,
                });

                setProgress(((i + 1) / files.length) * 100);
            } catch (error) {
                console.error('Compression error:', error);
            }
        }

        setImages(compressedImages);
        setIsCompressing(false);
    };

    const downloadImage = (image: CompressedImage) => {
        const url = URL.createObjectURL(image.compressed);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${image.original.name}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadAll = () => {
        images.forEach((image) => {
            downloadImage(image);
        });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
    const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);
    const totalReduction = totalOriginalSize > 0
        ? ((1 - totalCompressedSize / totalOriginalSize) * 100)
        : 0;

    return (
        <div className="space-y-4">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Image Compressor</h2>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                            Quality: {quality}%
                        </label>
                        <input
                            type="range"
                            id="quality"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Lower size</span>
                            <span>Higher quality</span>
                        </div>
                    </div>

                    <div>
                        <CustomSelect
                            id="maxWidth"
                            label={`Max Width: ${maxWidth === 10000 ? 'Original' : maxWidth + 'px'}`}
                            value={maxWidth.toString()}
                            onChange={(val) => setMaxWidth(parseInt(val))}
                            options={maxWidthOptions}
                        />
                    </div>
                </div>

                {/* Upload Area */}
                <div className="mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="imageUpload"
                        disabled={isCompressing}
                    />
                    <label
                        htmlFor="imageUpload"
                        className={`block border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isCompressing
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-primary-300 hover:border-primary-400 bg-primary-50 hover:bg-primary-100'
                            }`}
                    >
                        {isCompressing ? (
                            <div>
                                <div className="text-4xl mb-2">⏳</div>
                                <div className="text-lg font-medium text-gray-900">Compressing...</div>
                                <div className="text-sm text-gray-600 mt-2">{progress.toFixed(0)}% complete</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-4xl mb-2">📸</div>
                                <div className="text-lg font-medium text-gray-900">
                                    Click to upload images
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    Supports JPEG, PNG, WebP (multiple files allowed)
                                </div>
                            </div>
                        )}
                    </label>
                </div>

                {/* Results Summary */}
                {images.length > 0 && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Compression Results</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div>{images.length} image{images.length > 1 ? 's' : ''} compressed</div>
                                    <div>
                                        {formatBytes(totalOriginalSize)} → {formatBytes(totalCompressedSize)}
                                    </div>
                                    <div className="text-green-700 font-semibold">
                                        {totalReduction.toFixed(1)}% size reduction
                                    </div>
                                </div>
                            </div>
                            <button onClick={downloadAll} className="btn-primary">
                                ⬇️ Download All
                            </button>
                        </div>
                    </div>
                )}

                {/* Individual Images */}
                {images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <img
                                    src={image.preview}
                                    alt={image.original.name}
                                    className="w-full h-48 object-cover rounded mb-3"
                                />
                                <div className="space-y-2">
                                    <div className="font-medium text-gray-900 truncate">
                                        {image.original.name}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Original:</span>
                                            <span className="font-medium">{formatBytes(image.originalSize)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Compressed:</span>
                                            <span className="font-medium text-green-600">
                                                {formatBytes(image.compressedSize)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Reduction:</span>
                                            <span className="font-bold text-green-700">
                                                {image.reduction.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => downloadImage(image)}
                                        className="btn-secondary w-full mt-2 text-sm"
                                    >
                                        ⬇️ Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 border-blue-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
                    <p className="text-gray-600">
                        Compresses images by reducing quality and resizing while maintaining visual appearance. All processing happens in your browser - images never leave your device.
                    </p>
                </div>

                <div className="card bg-green-50 border-green-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Use 70-80% quality for web</li>
                        <li>• Resize to actual display size</li>
                        <li>• WebP for best compression</li>
                        <li>• Keep originals as backup</li>
                    </ul>
                </div>

                <div className="card bg-purple-50 border-purple-200 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy</h3>
                    <p className="text-gray-600">
                        100% client-side processing. Your images are never uploaded to any server. Everything happens in your browser.
                    </p>
                </div>
            </div>
        </div>
    );
}
