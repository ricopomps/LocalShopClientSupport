import { RequestHandler } from "express";
import { NotificationService } from "../service/notificationService";
import { assertIsDefined } from "../util/assertIsDefined";
import { encryptResponse } from "../middleware/encryptResponse";

const notificationService = new NotificationService();

export const createNotification: RequestHandler = async (req, res, next) => {
  try {
    const { userId, message } = req.body;
    await notificationService.createNotification(userId, message);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

export const getNotifications: RequestHandler = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(
      req.userId
    );
    res.status(200).json(encryptResponse(notifications));
  } catch (error) {
    next(error);
  }
};

export const deleteNotification: RequestHandler = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const readNotification: RequestHandler = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await notificationService.readNotification(notificationId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const readAllNotifications: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    assertIsDefined(userId);
    await notificationService.readAllNotification(userId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const removeAllNotifications: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.userId;
    assertIsDefined(userId);
    await notificationService.removeAllNotifications(userId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
