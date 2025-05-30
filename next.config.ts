import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

    images: {
        remotePatterns: [
            {
                protocol:'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
