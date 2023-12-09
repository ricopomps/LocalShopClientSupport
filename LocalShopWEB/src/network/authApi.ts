import { UserType } from "../models/user";
import ApiService from "./api";

export interface SendRecoverPasswordEmailForm {
  email: string;
}

const baseUrl = "/api/auth";
const apiService = ApiService.getInstance();

export async function sendRecoverPasswordEmail(
  credentials: SendRecoverPasswordEmailForm
): Promise<void> {
  const { data } = await apiService
    .getApi()
    .post(`${baseUrl}/recover`, credentials);
  return data;
}

export interface RecoverPasswordForm {
  token?: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export async function changePassword(
  credentials: RecoverPasswordForm
): Promise<void> {
  const { data } = await apiService
    .getApi()
    .post(`${baseUrl}/change`, credentials);
  return data;
}

export async function googleAuth(userType?: UserType) {
  const { data } = await apiService
    .getApi()
    .post(`${baseUrl}/oauth`, { userType });
  return data;
}

export async function getGoogleAuthUser(code: string, userType?: string) {
  const { data } = await apiService.getApi().get(`${baseUrl}/oauth`, {
    params: { code, userType },
  });
  return data;
}

export async function refresh() {
  const { data } = await apiService.getApi().get(`${baseUrl}/refresh`);
  return data;
}
