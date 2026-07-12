const fs = require('fs');

const filePath = '/Users/dakshhiran/.gemini/antigravity-ide/brain/33da57c3-9476-47dc-bb59-0b5e30cb9c62/.system_generated/steps/1099/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("Analyzing escaped JSON content...");

// Look for fileId with optional escaping backslashes
const regex = /fileId\\*"\s*:\s*\\*"([^"\\]+)/gi;
let match;
const fileIds = new Set();
while ((match = regex.exec(content)) !== null) {
  fileIds.add(match[1]);
}

console.log("Extracted File IDs:", Array.from(fileIds).slice(0, 15));

// Let's find how next/image src is constructed, or search for "supabase", "s3", or other storage host domains
const domainsRegex = /(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+)/gi;
const domains = new Set();
let domMatch;
while ((domMatch = domainsRegex.exec(content)) !== null) {
  domains.add(domMatch[1]);
}
console.log("Unique domains in page:", Array.from(domains));
