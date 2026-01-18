const fs = require('fs');
const path = require('path');

const defaultDtsPath = path.join(__dirname, '../node_modules/.prisma/client/default.d.ts');
const defaultJsPath = path.join(__dirname, '../node_modules/.prisma/client/default.js');
const clientTsPath = path.join(__dirname, '../node_modules/.prisma/client/client.ts');
const clientJsPath = path.join(__dirname, '../node_modules/.prisma/client/client.js');

// Create default.d.ts and default.js if they don't exist and client files exist
if (fs.existsSync(clientTsPath) && !fs.existsSync(defaultDtsPath)) {
  fs.writeFileSync(defaultDtsPath, "export * from './client'\n");
  console.log('Created default.d.ts for Prisma client');
}

if (fs.existsSync(clientJsPath) && !fs.existsSync(defaultJsPath)) {
  fs.writeFileSync(defaultJsPath, "module.exports = require('./client');\n");
  console.log('Created default.js for Prisma client');
}
