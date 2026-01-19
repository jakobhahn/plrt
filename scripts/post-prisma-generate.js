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
// we need to create a wrapper that references the TypeScript file with extension
if (!fs.existsSync(defaultJsPath)) {
  // Use require with .ts extension - Next.js with transpilePackages should handle it
  // If that doesn't work, we'll need to use a different approach
  const defaultJsContent = `// Prisma Client wrapper for custom output path
// Next.js will transpile TypeScript files during build when transpilePackages is configured
try {
  module.exports = require('./client.ts');
} catch (e) {
  // Fallback: try without extension (shouldn't work but worth trying)
  try {
    module.exports = require('./client');
  } catch (e2) {
    throw new Error('Failed to load Prisma client: ' + e.message);
  }
}
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
