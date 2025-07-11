const fs = require("fs");
const crypto = require("crypto");

const filename = "newkeys.json";

// ⚡ Your secret passphrase (must match client-side)
const secret = "HeYbR0sT0pSK1dD1ng0r1lld1dlley0u"; // << Change this!

// AES settings
const algorithm = "aes-256-cbc";

// Make 32-byte key from passphrase
const key = crypto.createHash("sha256").update(secret).digest();

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename));
}

if (!data.encrypted || now - data.created_at > dayMs) {
  // Make new raw key (15 chars alphanumeric)
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Generate new random IV every encryption
  const iv = crypto.randomBytes(16);

  // Encrypt the key
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
