const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.download': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ogv': 'video/ogg',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.zip': 'application/zip'
};

const mainHtml = fs.existsSync(path.join(ROOT_DIR, 'DubClub.html'))
  ? 'DubClub.html'
  : (fs.existsSync(path.join(ROOT_DIR, 'index.html')) ? 'index.html' : 'DubClub.html');

const server = http.createServer((req, res) => {
  let decodedUrl = decodeURI(req.url.split('?')[0]);
  if (decodedUrl === '/' || decodedUrl === '') {
    decodedUrl = '/' + mainHtml;
  }

  const filePath = path.join(ROOT_DIR, decodedUrl);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File non trovato: ' + decodedUrl);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log('==================================================');
  console.log(`  DubClub Studio - Server Locale Attivo!`);
  console.log(`  Indirizzo: ${url}`);
  console.log('  Premi CTRL+C per arrestare il server.');
  console.log('==================================================');

  const openCmd = process.platform === 'win32' ? `start "" "${url}"` : `open "${url}"`;
  exec(openCmd);
});
