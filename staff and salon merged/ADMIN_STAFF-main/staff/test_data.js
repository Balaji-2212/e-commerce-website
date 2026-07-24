const fs = require('fs');
eval(fs.readFileSync('data.js', 'utf8'));
let noNameCount = 0;
SERVICE_CATALOG.forEach(s => {
  if (!s.name) {
    console.log("Found service without name:", s);
    noNameCount++;
  }
});
console.log("Total without name:", noNameCount);
