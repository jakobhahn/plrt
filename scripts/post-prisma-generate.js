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
// Since client.ts is TypeScript, we need to create a .js file that Next.js can process
// The solution: create a .js file that re-exports from client.ts using ESM syntax
// Next.js will handle the TypeScript compilation during build
if (!fs.existsSync(defaultJsPath)) {
  // Use ESM export syntax - Next.js will compile client.ts during build
  // This matches how Next.js handles TypeScript imports
  const defaultJsContent = `export * from './client';
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
