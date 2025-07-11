const fs = require('fs');

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function xorObfuscate(input, key) {
  return input.split('')
    .map(c => String.fromCharCode(c.charCodeAt(0) ^ key))
    .join('');
}

const FILE = 'justarandomfiledontlookhereitdoesntmatterthatmuch.json';
let json = {};

if (fs.existsSync(FILE)) {
  const content = fs.readFileSync(FILE, 'utf8');
  if (content.trim().length > 0) {
    json = JSON.parse(content);
  }
}

const newKey = generateRandomString(15);
const obfuscated = xorObfuscate(newKey, 42);
const timestamp = Math.floor(Date.now() / 1000);

const index = 'key' + (Object.keys(json).length + 1);
json[index] = {
  value: obfuscated,
  created: timestamp,
  hwid: null
};

fs.writeFileSync(FILE, JSON.stringify(json, null, 2));

console.log(`✅ New obfuscated key generated & saved.`);
