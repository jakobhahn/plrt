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

// Create default.js - must match the pattern from @prisma/client/default.js
// It requires '.prisma/client/default', so we need to export from client
// Since Prisma 7 only generates TypeScript files, we need to create a wrapper
// that Next.js can process. The key is matching the exact pattern.
if (!fs.existsSync(defaultJsPath)) {
  // Match the exact pattern from @prisma/client/default.js
  // It uses spread operator to re-export everything from client
  const defaultJsContent = `module.exports = {
  ...require('./client'),
}
`;
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log('Created default.js for Prisma client');
}
