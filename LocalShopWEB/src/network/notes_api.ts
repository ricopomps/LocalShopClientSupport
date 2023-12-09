import { Note } from "../models/note";
import { User, UserType } from "../models/user";
import { ProfileForm } from "../pages/ProfilePage";
import ApiService from "./api";
//USER ROUTES
const apiService = ApiService.getInstance();

export async function getLoggedInUser(): Promise<User> {
  const response = await apiService.getApi().get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
  userType: UserType;
  cpf: string;
  confirmedPassword: string;
}

export async function signUp(
  credentials: SignUpCredentials,
  setAccessToken: (accessToken: string) => void
): Promise<User> {
  const { data } = await apiService
    .getApi()
    .post("/api/users/signup", credentials);
  setAccessToken(data.accessToken);
  return data.user;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials,
  setAccessToken: (accessToken: string) => void
): Promise<User> {
  const {
    data: { user, accessToken },
  } = await apiService.getApi().post("/api/auth", credentials);
  setAccessToken(accessToken);
  return user;
}

export async function logout() {
  await apiService.getApi().post("/api/auth/logout");
}

export async function updateUser(user: ProfileForm) {
  const response = await apiService.getApi().patch("/api/users", user);
  return response.data;
}

export async function favoriteStore(storeId: string) {
  const response = await apiService.getApi().post("/api/users/favoriteStores", {
    storeId,
  });
  return response.data;
}

export async function favoriteProduct(productId: string) {
  const response = await apiService
    .getApi()
    .post("/api/users/favoriteProduct", {
      productId,
    });
  return response.data;
}

export async function unfavoriteProduct(productId: string) {
  const response = await apiService
    .getApi()
    .post("/api/users/unFavoriteProduct", {
      productId,
    });
  return response.data;
}

export async function unfavoriteStore(storeId: string) {
  const response = await apiService
    .getApi()
    .post("/api/users/unFavoriteStores", {
      storeId,
    });
  return response.data;
}

//NOTES ROUTES
export async function fetchNotes(): Promise<Note[]> {
  const response = await apiService
    .getApi()
    .get("/api/notes", { withCredentials: true });
  return response.data;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await apiService.getApi().post("/api/notes", note);
  return response.data;
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await apiService
    .getApi()
    .patch(`/api/notes/${noteId}`, note);
  return response.data;
}

export async function deleteNote(noteId: string) {
  await apiService.getApi().delete(`/api/notes/${noteId}`);
}
