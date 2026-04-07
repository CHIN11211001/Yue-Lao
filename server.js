const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const DIST_DIR = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // 處理 base path /Yue-Lao/
  let urlPath = req.url.replace(/^\/Yue-Lao/, '');
  if (urlPath === '' || urlPath === '/') urlPath = '/index.html';
  
  let filePath = path.join(DIST_DIR, urlPath);
  
  if (!fs.existsSync(filePath)) {
    // 預設返回 index.html 處理 SPA 路由
    filePath = path.join(DIST_DIR, 'index.html');
  }
  
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  };
  
  const contentType = contentTypes[ext] || 'application/octet-stream';
  
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(500);
      res.end(`Server Error: ${error.code}`);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/Yue-Lao/`);
});

// 保持程序運行
process.on('SIGINT', () => {
  console.log('Stopping server...');
  process.exit();
});
