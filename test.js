const crypto = require("crypto");

const secret = "HeYbR0sT0pSK1dD1ng0r1lld1dlley0u";
const encrypted = "zRz70ZX9eMw/vsjtLaBxKw==";
const ivBase64 = "6OoFDr2/J8LoIQ/yB0yX8w==";

const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256").update(secret).digest();
const iv = Buffer.from(ivBase64, "base64");

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, "base64", "utf8");
decrypted += decipher.final("utf8");

console.log("✅ Node decrypt result:", decrypted);
