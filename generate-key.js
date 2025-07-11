const fs = require("fs");

const filename = "newkeys.json";
const passphrase = "HeYbR0sT0pSK1dD1ng0r1lld1dlley0u";
const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename));
}

if (!data.encrypted || now - data.created_at > dayMs) {
  // Generate new key
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // XOR encrypt
  let encrypted = "";
  for (let i = 0; i < rawKey.length; i++) {
    encrypted += String.fromCharCode(
      rawKey.charCodeAt(i) ^ passphrase.charCodeAt(i % passphrase.length)
    );
  }

  const encryptedBase64 = Buffer.from(encrypted).toString("base64");

  data = {
    encrypted: encryptedBase64,
    created_at: now
  };

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ New XOR encrypted key: ${rawKey}`);
} else {
  console.log(`✅ Key still valid.`);
}
