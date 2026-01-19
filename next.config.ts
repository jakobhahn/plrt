import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow transpiling Prisma client from node_modules
  // This allows Next.js to compile TypeScript files in @prisma/client
  transpilePackages: ['@prisma/client'],
};

export default nextConfig;
