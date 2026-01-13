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
                    : 'https://api.webutilspro.com/api/:path*',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/ads.txt',
                destination: 'https://srv.adstxtmanager.com/19390/webutilspro.com',
                permanent: true,
            },
        ];
    }
};

module.exports = nextConfig;
