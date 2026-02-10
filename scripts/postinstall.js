#!/usr/bin/env node
// Postinstall script to patch Next.js for Node.js 24 compatibility

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'build', 'generate-build-id.js');

try {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already patched
    if (!content.includes('Node.js 24 compatibility')) {
      content = content.replace(
        'async function generateBuildId(generate, fallback) {\n    let buildId = await generate();',
        `async function generateBuildId(generate, fallback) {
    // Workaround for Node.js 24 compatibility
    let buildId = typeof generate === 'function' ? await generate() : null;`
      );

      fs.writeFileSync(filePath, content);
      console.log('Patched Next.js generate-build-id.js for Node.js 24 compatibility');
    }
  }
} catch (error) {
  console.warn('Warning: Could not patch Next.js:', error.message);
}
