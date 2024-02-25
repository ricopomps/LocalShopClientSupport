import { Types } from "mongoose";
import ApiService from "../api";

export interface Notification {
  _id: string;
  userId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

const baseUrl = "/api/notifications";
const apiService = new ApiService(process.env.API_NOTIFICATIONS_BASE_URL);

export async function createNotification(
  userId: string | Types.ObjectId,
  message: string,
  token?: string
): Promise<void> {
  const { data } = await apiService
    .getApi(token)
    .post(baseUrl, { userId, message });
  return data;
}

export async function getNotification(token?: string): Promise<Notification[]> {
  const { data } = await apiService.getApi(token).get(`${baseUrl}`);
  return data;
}

export async function deleteNotification(
  notificationId: string,
  token?: string
): Promise<void> {
  const { data } = await apiService
    .getApi(token)
    .delete(`${baseUrl}/${notificationId}`);
  return data;
}

export async function readNotification(
  notificationId: string,
  token?: string
): Promise<void> {
  await apiService.getApi(token).patch(`${baseUrl}/read/${notificationId}`);
}

export async function readAllNotifications(token?: string): Promise<void> {
  await apiService.getApi(token).patch(baseUrl);
}

export async function removeAllNotifications(token?: string): Promise<void> {
  await apiService.getApi(token).delete(baseUrl);
}
