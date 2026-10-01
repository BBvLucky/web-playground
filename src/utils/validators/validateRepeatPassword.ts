export function validateConfirm(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "Подтвердите пароль";
  if (password !== confirm) return "Пароли не совпадают";
  return null;
}
