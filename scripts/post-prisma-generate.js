const fs = require('fs');
const path = require('path');

const defaultDtsPath = path.join(__dirname, '../node_modules/.prisma/client/default.d.ts');
const clientTsPath = path.join(__dirname, '../node_modules/.prisma/client/client.ts');

// Create default.d.ts if it doesn't exist and client.ts exists
if (fs.existsSync(clientTsPath) && !fs.existsSync(defaultDtsPath)) {
  fs.writeFileSync(defaultDtsPath, "export * from './client'\n");
  console.log('Created default.d.ts for Prisma client');
}
