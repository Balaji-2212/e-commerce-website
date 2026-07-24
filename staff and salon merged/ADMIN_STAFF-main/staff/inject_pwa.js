const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const headTags = `
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#1A6B8A">
  <link rel="apple-touch-icon" href="icon-512.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
</head>`;

const swScript = `
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }
  </script>
</body>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('manifest.json')) {
    content = content.replace('</head>', headTags);
  }
  
  if (!content.includes('serviceWorker.register')) {
    content = content.replace('</body>', swScript);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Injected PWA to', file);
}
