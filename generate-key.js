const fs = require("fs");

const filename = "newkeys.json";

// Load existing key file if it exists
let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename));
}

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

// If no key exists, or it's older than 24 hours → make new one
if (!data.key || now - data.created_at > dayMs) {
  // Generate random 15-char key
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Obfuscate = simple base64 here
  const obfuscated = Buffer.from(rawKey).toString("base64");

  data = {
    key: obfuscated,
    created_at: now
  };

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ New key generated: ${rawKey} (obfuscated as ${obfuscated})`);
} else {
  console.log("✅ Key still valid, no new key generated.");
}
