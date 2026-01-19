import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow transpiling Prisma client from node_modules
  // Note: .prisma/client is not a package, so we need to handle it differently
  transpilePackages: ['@prisma/client'],
  // Configure experimental features to handle Prisma client
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;
