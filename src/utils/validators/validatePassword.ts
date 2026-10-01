import { MIN_PASSWORD_LENGTH, REQUIRED_MESSAGE } from "@/consts";

export function validatePassword(password: string): string | null {
  if (!password) return REQUIRED_MESSAGE;
  if (password.length < MIN_PASSWORD_LENGTH) return "Минимум 6 символов";
  return null;
}
