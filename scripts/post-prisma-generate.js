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
// Next.js/Turbopack will compile them, but we need a runtime wrapper
// Use ESM syntax that Next.js can handle
if (!fs.existsSync(defaultJsPath)) {
  // Create an ESM-compatible default.js that re-exports from client
  // Next.js will handle the TypeScript compilation
  const defaultJsContent = `// @ts-check
// Prisma Client wrapper - Next.js will compile client.ts
export * from './client';
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
