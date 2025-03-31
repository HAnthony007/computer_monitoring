import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: [
        "192.168.1.176",
        "192.168.1.147",
        "local-origin.dev",
        "*.local-origin.dev",
    ],
};

export default nextConfig;
