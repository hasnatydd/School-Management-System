const fs = require('fs');
const path = require('path');

const dbPath = path.resolve('prisma/dev.db');
const buf = fs.readFileSync(dbPath);
const b64 = buf.toString('base64');

const outputPath = path.resolve('src/lib/embedded-db.ts');
const fileContent = `// Auto-generated fallback embedded SQLite database for serverless deployment
export const EMBEDDED_DB_BASE64 = ${JSON.stringify(b64)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log('Generated src/lib/embedded-db.ts successfully! Size:', (b64.length / 1024).toFixed(1), 'KB');
