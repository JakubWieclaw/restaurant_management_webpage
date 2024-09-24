import { LoginResponseDTO } from "../api";

export interface UserState {
  loginResponse: LoginResponseDTO | null;
}
