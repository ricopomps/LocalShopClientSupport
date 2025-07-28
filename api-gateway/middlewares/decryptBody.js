const CryptoJS = require("crypto-js");

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY ?? "secretKey"; // TODO: use a cleanEnv file to correctly type this variable

function decryptBody(req, res, next) {
  let rawData = "";

  req.on("data", (chunk) => {
    rawData += chunk;
  });

  req.on("end", () => {
    try {
      console.log("rawData" + rawData);
      if (!rawData) return next();
      const parsed = JSON.parse(rawData);
      const encrypted = parsed?.data;

      if (!encrypted) {
        console.log("Missing encrypted data. body:", parsed);
        req.body = parsed;
        return next();
      }

      const bytes = CryptoJS.AES.decrypt(encrypted, encryptionKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      const decryptedJson = JSON.parse(decryptedText);

      req.body = decryptedJson;
      console.log("Decryption successful:", req.body);
      next();
    } catch (err) {
      console.error("Decryption or parsing error:", err);
      res.status(400).json({ error: "Invalid or unreadable encrypted data." });
    }
  });

  req.on("error", (err) => {
    console.error("Request stream error:", err);
    res.status(400).json({ error: "Failed to read request body." });
  });
}

module.exports = decryptBody;
