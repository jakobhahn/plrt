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
// Next.js/Turbopack compiles them, but we need a runtime wrapper
// The key is to reference client.ts directly - Next.js will handle compilation
if (!fs.existsSync(defaultJsPath)) {
  // Reference client.ts directly - Next.js will compile it during build
  const defaultJsContent = `// Prisma Client wrapper for custom output path
// Next.js will compile client.ts during the build process
module.exports = require('./client.ts');
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
