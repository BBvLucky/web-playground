/**
 * Преобразует технические ошибки Supabase в понятные сообщения для пользователя.
 * 
 * @param error - Объект ошибки от Supabase с свойством message
 * @returns Понятное сообщение об ошибке на русском языке
 */
export function getUserFriendlyError(error: { message: string }): string {
  // Ошибки регистрации
  if (error.message.includes("The email already has an associated account")) {
    return "Этот email уже зарегистрирован. Пожалуйста, войдите под своими учетными данными.";
  }

  if (error.message.includes("Email confirmation is required")) {
    return "Для завершения регистрации необходимо подтвердить email. Проверьте вашу почту и нажмите кнопку подтверждения.";
  }

  // Ошибки входа
  if (error.message.includes("Invalid login credentials") || error.message.includes("Incorrect email or password")) {
    return "Неверный email или пароль. Пожалуйста, проверьте и попробуйте снова.";
  }

  if (error.message.includes("Rate limit")) {
    return "Слишком много попыток входа. Пожалуйста, подождите немного перед повторной попыткой.";
  }

  // Ошибки подтверждения email
  if (error.message.includes("Email confirmation is required") || error.message.includes("confirm your email")) {
    return "Пожалуйста, подтвердите свой email по ссылке, которую мы отправили на вашу почту.";
  }

  // Общие ошибки Supabase
  if (error.message.includes("Invalid grant")) {
    return "Сессия истекла. Пожалуйста, войдите снова.";
  }

  if (error.message.includes("Session expired")) {
    return "Ваша сессия истекла. Пожалуйста, войдите снова.";
  }

  // Если ошибка неизвестная — показываем сообщение из Supabase
  return error.message || "Произошла ошибка при аутентификации. Пожалуйста, попробуйте позже.";
}