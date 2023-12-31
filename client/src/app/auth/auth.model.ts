export interface AuthData {
  username: string | null;
  password: string | null;
  email: string | null;
  role: string;
  invitationCode: string | null;
}

export interface LoginResponse {
  userId: string;
  userName: string;
}
