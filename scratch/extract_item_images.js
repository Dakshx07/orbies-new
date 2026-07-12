const fs = require('fs');

const filePath = '/Users/dakshhiran/.gemini/antigravity-ide/brain/33da57c3-9476-47dc-bb59-0b5e30cb9c62/.system_generated/steps/1123/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("Analyzing item page HTML...");

// Search for og:image or twitter:image
const ogRegex = /property="og:image"\s+content="([^"]+)"/gi;
let match = ogRegex.exec(content);
console.log("og:image:", match ? match[1] : 'not found');

const twitterRegex = /name="twitter:image"\s+content="([^"]+)"/gi;
match = twitterRegex.exec(content);
console.log("twitter:image:", match ? match[1] : 'not found');

// Search for any absolute https image URLs ending in png/webp/jpg
const absoluteImgRegex = /https?:\/\/[^\s"',]+?\.(webp|png|jpg|jpeg)/gi;
const absImages = new Set();
while ((match = absoluteImgRegex.exec(content)) !== null) {
  absImages.add(match[0]);
}
console.log("Absolute image URLs found:", Array.from(absImages));

// Search for img tags in HTML
const imgRegex = /<img[^>]+>/gi;
const tags = [];
while ((match = imgRegex.exec(content)) !== null) {
  tags.push(match[0]);
}
console.log(`Found ${tags.length} <img> tags:`);
tags.slice(0, 10).forEach((t, i) => console.log(`  ${i}: ${t}`));
