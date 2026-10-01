import { REQUIRED_MESSAGE } from "@/consts";

export function validateEmail(email: string): string | null {
  if (!email) return REQUIRED_MESSAGE;
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Некорректный email";
  return null;
}
