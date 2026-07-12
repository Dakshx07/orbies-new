const fs = require('fs');

const filePath = '/Users/dakshhiran/.gemini/antigravity-ide/brain/33da57c3-9476-47dc-bb59-0b5e30cb9c62/.system_generated/steps/1123/content.md';
const content = fs.readFileSync(filePath, 'utf8');

const regex = /https:\/\/lftz25oez4aqbxpq\.public\.blob\.vercel-storage\.com\/[a-zA-Z0-9.-]+\.png/gi;
const urls = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  urls.add(match[0]);
}

console.log("Direct Vercel Storage PNG URLs:");
console.log(Array.from(urls));
