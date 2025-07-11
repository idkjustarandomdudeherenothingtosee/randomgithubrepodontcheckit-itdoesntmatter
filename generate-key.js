const fs = require("fs");

const filename = "newkeys.json";
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

// Load existing file if present
let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename, "utf8"));
}

// If no key or expired → generate new one
if (!data.key || now - data.created_at > oneDay) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  data = {
    key: rawKey,
    created_at: now
  };
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
  console.log("✅ Generated new key:", rawKey);
} else {
  console.log("✅ Key still valid:", data.key);
}
