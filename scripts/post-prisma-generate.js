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

// Create default.js - Prisma 7 generates TypeScript files that Next.js compiles
// We need to create a CommonJS wrapper that works at runtime
// Since client.ts will be compiled by Next.js, we can't require it directly
// Instead, we need to export everything that @prisma/client expects
if (!fs.existsSync(defaultJsPath)) {
  // Create a wrapper that exports from the internal class module
  // This matches how Prisma 7 structures the client
  const defaultJsContent = `// Prisma Client wrapper for custom output path
const client = require('./client');
module.exports = client;
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
