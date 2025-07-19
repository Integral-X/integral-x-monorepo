#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const YEAR = new Date().getFullYear();
const LICENSE_HEADER = `/*\n * Copyright (c) ${YEAR} Integral-X or Integral-X affiliate company. All rights reserved.\n */\n`;
const EXCLUDE_DIRS = ["node_modules", "dist", "coverage"];

function shouldProcess(filePath) {
  return (
    filePath.endsWith(".ts") &&
    !EXCLUDE_DIRS.some((dir) => filePath.split(path.sep).includes(dir))
  );
}

function addOrUpdateHeader(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  // Remove existing license header if present
  const newContent = content.replace(/^\/\*[\s\S]*?\*\/(\s*)/m, "");
  fs.writeFileSync(filePath, LICENSE_HEADER + newContent, "utf8");
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) walk(fullPath);
    } else if (shouldProcess(fullPath)) {
      addOrUpdateHeader(fullPath);
      console.log("Updated license header:", fullPath);
    }
  });
}

walk(process.cwd());
console.log("License headers updated.");
