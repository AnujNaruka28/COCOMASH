/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            }
        ]
    },
    transpilePackages: ['y-codemirror.next', 'yjs']
};

export default nextConfig;

