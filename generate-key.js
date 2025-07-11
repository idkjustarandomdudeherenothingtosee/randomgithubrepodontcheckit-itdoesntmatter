const fs = require("fs");

const filename = "newkeys.json";
const passphrase = "YOUR_SECRET_XOR_PASSPHRASE";
const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename, "utf8"));
}

if (!data.encrypted || now - data.created_at > dayMs) {
  // Make new random 15-char key
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

  // Convert binary XOR result to base64 for safe storage
  const encryptedBase64 = Buffer.from(encrypted, "binary").toString("base64");

  data = {
    encrypted: encryptedBase64,
    created_at: now
  };

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ New XOR-encrypted key generated and saved.`);
  console.log(`Decrypted key was: ${rawKey}`);
} else {
  console.log(`✅ Key still valid.`);
}
