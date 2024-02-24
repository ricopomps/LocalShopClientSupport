import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import ApiService from "../network/api";
import env from "../util/validateEnv";
const apiService = ApiService.getInstance();

export const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const header = authHeader?.toString();
  console.log("verifyJWT", header);

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden token" });

    req.user = (decoded as any)?.UserInfo.username;
    req.userId = (decoded as any)?.UserInfo.userId;
    req.storeId = (decoded as any)?.UserInfo.storeId;
    req.userType = (decoded as any)?.UserInfo.userType;
    apiService.setAccessToken(token);
    next();
  });
};
