import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
  console.log("requiresAuth");
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "Usuário não autenticado"));
  }
};
