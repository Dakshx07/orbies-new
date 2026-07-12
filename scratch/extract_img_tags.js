const fs = require('fs');

const filePath = '/Users/dakshhiran/.gemini/antigravity-ide/brain/33da57c3-9476-47dc-bb59-0b5e30cb9c62/.system_generated/steps/1099/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("Analyzing <img> tag sources...");

const regex = /<img[^>]+>/gi;
let match;
const tags = [];
while ((match = regex.exec(content)) !== null) {
  tags.push(match[0]);
}

console.log("Found <img> tags:", tags.slice(0, 10));

// Let's print out the src of the first few img tags
tags.slice(0, 15).forEach((tag, idx) => {
  const srcMatch = /src="([^"]+)"/i.exec(tag);
  const altMatch = /alt="([^"]+)"/i.exec(tag);
  console.log(`Image ${idx}: src="${srcMatch ? srcMatch[1] : 'none'}" alt="${altMatch ? altMatch[1] : 'none'}"`);
});
