#!/usr/bin/env node

/**
 * Favicon Generator Script
 * This script creates a simple favicon.ico file using Canvas
 */

const fs = require('fs');
const path = require('path');

// Create a simple base64 encoded ICO file with DharmaChain colors
const iconData = `
AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAMMOAADDDgAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5P////////////////////////////////////////////////////////////////////////////////////////////59/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzk////////////////////////////////////////////////////////////////////////////////////////////ff6c5H3+nOR9/pzkff6c5P///////////////////////////////////////////////39/f39/f39//////////////////////3+nOR9/pzkff6c5H3+nOR////////////////////////////////////////////////////////////////////////////////////////////////9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5P////////////////////////////////////////////////////////////////////////////////////////////////3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzk////////////////////////////////////////////////////////////////////////////////////////////////ff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5P////////////////////////////////////////////////////////////////////////////////////////////////3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzk////////////////////////////////////////////////////////////////////////////////////////////////ff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5P////////////////////////////////////////////////////////////////////////////////////////////////3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzk////////////////////////////////////////////////////////////////////////////////////////////////ff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5P////////////////////////////////////////////////////////////////////////////////////////////////3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzk////////////////////////////////////////////////////////////////////////////////////////////ff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5P////////////////////////////////////////////////////////////////////////////////////////////3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzkff6c5H3+nOR9/pzk/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA
`;

// Convert base64 to buffer
const iconBuffer = Buffer.from(iconData.trim(), 'base64');

// Write to public folder
const publicPath = path.join(process.cwd(), 'public');
const faviconPath = path.join(publicPath, 'favicon.ico');

// Ensure public directory exists
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}

// Write the favicon
fs.writeFileSync(faviconPath, iconBuffer);

console.log('✅ Generated favicon.ico');
console.log('✅ Created with DharmaChain orange theme');
console.log('📁 Saved to:', faviconPath);
