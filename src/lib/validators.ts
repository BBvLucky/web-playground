import { MIN_PASSWORD_LENGTH, REQUIRED_MESSAGE } from "@/consts";

export function validateEmail(email: string): string | null {
  if (!email) return REQUIRED_MESSAGE;
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Некорректный email";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return REQUIRED_MESSAGE;
  if (password.length < MIN_PASSWORD_LENGTH) return "Минимум 6 символов";
  return null;
}

export function validateConfirm(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "Подтвердите пароль";
  if (password !== confirm) return "Пароли не совпадают";
  return null;
}
