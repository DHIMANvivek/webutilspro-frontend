/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://72.62.163.53:4000/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
