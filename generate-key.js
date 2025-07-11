const fs = require("fs");
const crypto = require("crypto");

const filename = "justarandomfiledontlookhereitdoesntmatterthatmuch.json";

// ⚡ Your secret passphrase (hardcoded here)
const secret = "SuperSecretPassphrase123!"; // << Change this!

// AES settings
const algorithm = "aes-256-cbc";

// Make random 32-byte key from passphrase
const key = crypto.createHash("sha256").update(secret).digest();

// Random 16-byte IV for AES-CBC
const iv = crypto.randomBytes(16);

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename));
}

if (!data.encrypted || now - data.created_at > dayMs) {
  // Make new raw key
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Encrypt
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(rawKey, "utf8", "base64");
  encrypted += cipher.final("base64");

  data = {
    encrypted: encrypted,
    iv: iv.toString("base64"),
    created_at: now
  };

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ New key generated and encrypted.`);
} else {
  console.log(`✅ Key still valid.`);
}
