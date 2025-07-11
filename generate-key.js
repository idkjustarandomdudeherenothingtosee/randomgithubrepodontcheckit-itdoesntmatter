const fs = require("fs");

const filename = "newkeys.json";
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

// Load existing
let data = {};
if (fs.existsSync(filename)) {
  data = JSON.parse(fs.readFileSync(filename, "utf8"));
}

// If expired or missing, make a new key
if (!data.key || (now - data.created_at) > oneDay) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rawKey = "";
  for (let i = 0; i < 15; i++) {
    rawKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  data = {
    key: rawKey,
    created_at: now
  };
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log("✅ New key generated:", rawKey);
} else {
  console.log("✅ Key still valid.");
}
