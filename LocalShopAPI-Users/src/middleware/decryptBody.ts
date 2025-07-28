import CryptoJS from "crypto-js";
import { NextFunction, Request, Response } from "express";

const encryptionKey: string =
  process.env.REACT_APP_ENCRYPTION_KEY ?? "secretKey"; // TODO: use a cleanEnv wrapper like `envalid` or `zod-env` for better safety

export function decryptBody(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const encrypted = (req.body as { data?: string })?.data;

  if (!encrypted) {
    console.log("Missing encrypted data. body:", req.body);
    return next();
  }

  console.log("encrypted:", encrypted);

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, encryptionKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    const decryptedJson = JSON.parse(decryptedText);

    req.body = decryptedJson;
    console.log("Decryption result:", req.body);
    return next();
  } catch (err) {
    console.error("Decryption error:", err);
    res.status(400).json({ error: "Invalid encrypted data." });
  }
}
