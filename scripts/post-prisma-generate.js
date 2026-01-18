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

// Create default.js - must match the pattern used by @prisma/client/default.js
// It should re-export from the client, but since client.ts is TypeScript,
// we need to use a pattern that works with Next.js/Turbopack
if (!fs.existsSync(defaultJsPath)) {
  // Use the same pattern as @prisma/client/default.js but reference client directly
  // Next.js will handle TypeScript compilation
  fs.writeFileSync(defaultJsPath, "module.exports = require('./client.ts');\n");
  console.log('Created default.js for Prisma client');
}
