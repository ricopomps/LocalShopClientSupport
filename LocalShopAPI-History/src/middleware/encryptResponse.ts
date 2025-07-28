import CryptoJS from "crypto-js";

const encryptionKey: string = process.env.ENCRYPTION_KEY ?? "secretKey"; // TODO: use a cleanEnv wrapper like `envalid` or `zod-env` for better safety

export function encryptResponse(data: any) {
  const jsonStr = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonStr, encryptionKey).toString();
  return { data: encrypted };
}
