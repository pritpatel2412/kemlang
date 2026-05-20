const cp = require("child_process");
const path = require("path");

const args = process.argv.slice(2); // [0] = path to .kem file
const filePath = args[0];

console.log(`🚀 Running ${filePath}...`);

const run = cp.spawn("node", [filePath], {
  stdio: "inherit"
});

// If you want to use your own KemLang interpreter, replace "node" with your executable name.
