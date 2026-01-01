/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api.webutilspro.com/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
