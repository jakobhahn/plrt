import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow transpiling Prisma client from node_modules
  // This allows Next.js to compile TypeScript files in @prisma/client
  transpilePackages: ['@prisma/client'],
  // Configure webpack to handle .ts files in node_modules/.prisma/client
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add .prisma/client to the list of directories that can be transpiled
      config.resolve.alias = {
        ...config.resolve.alias,
        '.prisma/client': path.resolve(__dirname, 'node_modules/.prisma/client'),
      };
    }
    return config;
  },
};

export default nextConfig;
