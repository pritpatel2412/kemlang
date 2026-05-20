const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const kemFile = args[0] || process.env.KEM_PROGRAM;

if (!kemFile || !fs.existsSync(kemFile)) {
  console.error("KemLang file not found.");
  process.exit(1);
}

const code = fs.readFileSync(kemFile, 'utf8');

// Simple mock parser for demonstration
console.log("🔰 Running KemLang...");
if (code.includes("lakho")) {
  const matches = code.match(/lakho\("(.*)"\);?/);
  if (matches) {
    console.log(`🖨️ Output: ${matches[1]}`);
  } else {
    console.log("🖨️ lakho found, but no string detected.");
  }
} else {
  console.log("✅ No recognizable output, but KemLang executed.");
}
