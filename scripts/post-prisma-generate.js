const fs = require('fs');
const path = require('path');

const prismaClientDir = path.join(__dirname, '../generated/prisma-client');
const defaultDtsPath = path.join(prismaClientDir, 'default.d.ts');
const defaultJsPath = path.join(prismaClientDir, 'default.js');
const clientTsPath = path.join(prismaClientDir, 'client.ts');

// Create default.d.ts if it doesn't exist and client.ts exists
if (fs.existsSync(clientTsPath) && !fs.existsSync(defaultDtsPath)) {
  fs.writeFileSync(defaultDtsPath, "export * from './client'\n");
  console.log('Created default.d.ts for Prisma client');
}

// Create default.js - Prisma 7 generates TypeScript files only
// Since the output is now outside node_modules, Next.js can compile it
// We use ESM export syntax which Next.js can process
if (!fs.existsSync(defaultJsPath)) {
  // Use ESM export syntax - Next.js will compile client.ts during build
  const defaultJsContent = `export * from './client';
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
