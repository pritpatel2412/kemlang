#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Get path to cli.py in the kemlang-backend folder
const backendPath = path.join(__dirname, "..", "kemlang-backend", "cli.py");

// Get user-provided arguments (i.e., the .kem file)
const args = process.argv.slice(2);

// Help message
const showHelp = () => {
  console.log("❌ Usage: kemlang <filename.kem>");
  process.exit(1);
};

// Ensure a file argument is provided
if (args.length !== 1) {
  showHelp();
}

const filePath = args[0];

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.log(`❌ Error: File '${filePath}' not found.`);
  process.exit(1);
}

// Spawn Python process to run the KemLang code
const pythonProcess = spawn("python", [backendPath, filePath], {
  stdio: "inherit",
});

// Exit with the same code
pythonProcess.on("close", (code) => {
  process.exit(code);
});
