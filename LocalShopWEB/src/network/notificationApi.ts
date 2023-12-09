import ApiService from "./api";

export interface Notification {
  _id: string;
  userId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

const baseUrl = "/api/notifications";
const apiService = ApiService.getInstance();

export async function createNotification(): Promise<void> {
  const { data } = await apiService.getApi().post(baseUrl);
  return data;
}

export async function getNotification(): Promise<Notification[]> {
  const { data } = await apiService.getApi().get(`${baseUrl}`);
  return data;
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const { data } = await apiService
    .getApi()
    .delete(`${baseUrl}/${notificationId}`);
  return data;
}

export async function readNotification(notificationId: string): Promise<void> {
  await apiService.getApi().patch(`${baseUrl}/read/${notificationId}`);
}

export async function readAllNotifications(): Promise<void> {
  await apiService.getApi().patch(baseUrl);
}

export async function removeAllNotifications(): Promise<void> {
  await apiService.getApi().delete(baseUrl);
}
