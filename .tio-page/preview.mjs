import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';

const root = resolve(process.argv[2] ?? new URL('./dist', import.meta.url).pathname);
const port = Number(process.argv[3] ?? 4321);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};
createServer((request, response) => {
  void (async () => {
    try {
      const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let file = resolve(root, '.' + path);
      if (!file.startsWith(root + '/') && file !== root) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const bytes = await readFile(file);
      response
        .writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' })
        .end(bytes);
    } catch {
      response.writeHead(404).end('Not found');
    }
  })();
}).listen(port, '127.0.0.1', () => console.log(`Blog preview: http://127.0.0.1:${port}`));
