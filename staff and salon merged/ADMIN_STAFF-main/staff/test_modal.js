const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

// Load data.js manually
const dataScript = fs.readFileSync('data.js', 'utf8');
window.eval(dataScript);

// Load app.js manually
const appScript = fs.readFileSync('app.js', 'utf8');
try {
  window.eval(appScript);
} catch (e) {
  console.log("Error loading app.js:", e.message);
}

try {
  window.openServiceTypeModal('walkin');
  console.log("Success!");
} catch (e) {
  console.log("Error running openServiceTypeModal:", e.message);
}
