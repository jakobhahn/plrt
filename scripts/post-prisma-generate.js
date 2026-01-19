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
// we need to create a wrapper that works with Next.js's module resolution
// Solution: Create a .js file that re-exports from @prisma/client directly
// This avoids the circular dependency issue
if (!fs.existsSync(defaultJsPath)) {
  // Re-export from @prisma/client/index which should work
  // This creates a bridge between the custom output path and @prisma/client
  const defaultJsContent = `// Prisma Client wrapper for custom output path
// This file is required by @prisma/client/default.js
// We re-export from @prisma/client to avoid TypeScript compilation issues
module.exports = require('@prisma/client');
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
