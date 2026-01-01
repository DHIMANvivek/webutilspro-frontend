/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    async rewrites() {
        const isDev = process.env.NODE_ENV !== 'production';
        const apiTarget = isDev ? 'http://localhost:4000' : 'https://api.webutilspro.com';

        console.log('[Next.js] Rewriting /api requests to:', apiTarget);

        return [
            {
                source: '/api/:path*',
                destination: `${apiTarget}/api/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
