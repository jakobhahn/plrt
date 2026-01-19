import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow transpiling Prisma client from node_modules
  transpilePackages: ['@prisma/client'],
};

export default nextConfig;
