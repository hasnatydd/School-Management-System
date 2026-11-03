import fs from 'fs';
import path from 'path';
import os from 'os';
import { EMBEDDED_DB_BASE64 } from './embedded-db';

let cachedDbUrl: string | null = null;

function toFileUrl(filePath: string): string {
  return `file:${filePath.replace(/\\/g, '/')}`;
}

export function getDatabaseUrl(): string {
  if (cachedDbUrl) {
    return cachedDbUrl;
  }

  const isVercel = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs'
  );

  if (isVercel) {
    const tmpDir = process.platform === 'win32' ? os.tmpdir() : '/tmp';
    const tmpDbPath = path.join(tmpDir, 'dev.db');

    // Ensure directory exists
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
      // ignore
    }

    // 1. Check if already initialized in /tmp
    if (fs.existsSync(tmpDbPath)) {
      try {
        const stats = fs.statSync(tmpDbPath);
        if (stats.size > 20000) {
          cachedDbUrl = toFileUrl(tmpDbPath);
          return cachedDbUrl;
        }
      } catch {
        // ignore
      }
    }

    // 2. Search for bundled file on disk
    const searchPaths = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join(process.cwd(), 'dev.db'),
      path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
      path.join(__dirname, '..', 'prisma', 'dev.db'),
      path.join(__dirname, 'dev.db'),
      '/var/task/prisma/dev.db',
      '/var/task/dev.db',
    ];

    let copied = false;
    for (const src of searchPaths) {
      try {
        if (fs.existsSync(src)) {
          const stats = fs.statSync(src);
          if (stats.size > 20000) {
            fs.copyFileSync(src, tmpDbPath);
            copied = true;
            console.log(`[InitDB] Copied SQLite database from ${src} to ${tmpDbPath} (${stats.size} bytes)`);
            break;
          }
        }
      } catch {
        // Continue searching
      }
    }

    // 3. Fallback to embedded base64 database if physical file was stripped
    if (!copied && EMBEDDED_DB_BASE64) {
      try {
        const buffer = Buffer.from(EMBEDDED_DB_BASE64, 'base64');
        fs.writeFileSync(tmpDbPath, buffer);
        console.log(`[InitDB] Restored SQLite database from embedded backup to ${tmpDbPath} (${buffer.length} bytes)`);
      } catch (err) {
        console.error('[InitDB] Failed to restore embedded database:', err);
      }
    }

    cachedDbUrl = toFileUrl(tmpDbPath);
    return cachedDbUrl;
  }

  // Local development: use absolute path to prisma/dev.db
  const localPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  if (fs.existsSync(localPath)) {
    cachedDbUrl = toFileUrl(localPath);
    return cachedDbUrl;
  }

  cachedDbUrl = process.env.DATABASE_URL || 'file:./dev.db';
  return cachedDbUrl;
}
