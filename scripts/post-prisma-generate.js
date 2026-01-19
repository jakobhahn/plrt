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
// Solution: Create a .js file that uses ESM export syntax
// Next.js should handle this during the build process
if (!fs.existsSync(defaultJsPath)) {
  // Use ESM export syntax - Next.js will compile client.ts during build
  // The key is using export * which Next.js can process
  const defaultJsContent = `export * from './client';
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
