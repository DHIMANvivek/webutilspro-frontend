/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
    experimental: {
        serverComponentsExternalPackages: ['pdfjs-dist'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NODE_ENV === 'development'
                    ? 'http://localhost:4000/api/:path*'
                    : 'https://api.webutilspro.cloud/api/:path*',
            },
        ];
    }
};

module.exports = nextConfig;
