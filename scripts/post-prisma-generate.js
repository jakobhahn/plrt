const fs = require('fs');
const path = require('path');

const prismaClientDir = path.join(__dirname, '../node_modules/.prisma/client');
const defaultDtsPath = path.join(prismaClientDir, 'default.d.ts');
const defaultJsPath = path.join(prismaClientDir, 'default.js');
const clientTsPath = path.join(prismaClientDir, 'client.ts');

// Create default.d.ts if it doesn't exist and client.ts exists
if (fs.existsSync(clientTsPath) && !fs.existsSync(defaultDtsPath)) {
  fs.writeFileSync(defaultDtsPath, "export * from './client'\n");
  console.log('Created default.d.ts for Prisma client');
}

// Create default.js - Prisma 7 generates TypeScript files
// The issue is that @prisma/client/default.js requires .prisma/client/default.js
// which needs to export the client. Since client.ts is TypeScript, we need
// to create a wrapper that Next.js can process during build
if (!fs.existsSync(defaultJsPath)) {
  // Create a file that exports everything from client
  // Next.js will compile this during the build, and the require will work
  // because Next.js handles TypeScript compilation
  const defaultJsContent = `// Prisma Client wrapper for custom output path
// This file bridges @prisma/client to the generated client
// Next.js compiles TypeScript during build, so we can reference .ts files
try {
  module.exports = require('./client');
} catch (e) {
  // Fallback: try with .ts extension (Next.js will handle it)
  try {
    module.exports = require('./client.ts');
  } catch (e2) {
    // If both fail, export empty object (should not happen in production)
    console.warn('Prisma client not found, using empty export');
    module.exports = {};
  }
}
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
