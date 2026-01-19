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

// Create default.js - Prisma 7 generates TypeScript files only
// @prisma/client/default.js requires '.prisma/client/default'
// Since Next.js can't compile TypeScript in node_modules directly,
// we need to create a CommonJS wrapper that works with Next.js's transpilation
if (!fs.existsSync(defaultJsPath)) {
  // Create a CommonJS wrapper - Next.js will transpile the TypeScript during build
  // The key is using require() which Next.js can handle for TypeScript files
  const defaultJsContent = `// Prisma Client wrapper for custom output path
// Next.js will transpile TypeScript files during build
module.exports = require('./client');
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
