const fs = require("fs");

const filename = "newkeys.json";
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename, "utf8"));
}

// If no key yet, or older than 24 h, make a new one
if (!data.encrypted || now - data.created_at > oneDay) {
  // 1) Generate raw key
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 2) Base64‑encode it for safe storage
  const encryptedBase64 = Buffer.from(rawKey, "utf8").toString("base64");

  data = {
    encrypted: encryptedBase64,
    created_at: now
  };

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log("✅ New key generated:", rawKey);
} else {
  console.log("✅ Key still valid, no change.");
}
