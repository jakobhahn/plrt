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
// ESM imports need the .ts extension for TypeScript files
if (!fs.existsSync(defaultJsPath)) {
  // Use ESM export syntax with .ts extension - Next.js will compile it during build
  const defaultJsContent = `export * from './client.ts';
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
