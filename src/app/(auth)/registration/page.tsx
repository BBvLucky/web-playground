"use client";

import { useCallback } from "react";
import Link from "next/link";

import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { MIN_PASSWORD_LENGTH } from "@/consts";

export default function RegisterPage() {
  const { errors, formError, values, loading, setField, handleSubmit } =
    useAuth("register");

  const handleEmailInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setField("email", e.target.value),
    [setField],
  );

  const handlePasswordInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setField("password", e.target.value),
    [setField],
  );

  const handleConfirmInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setField("confirm", e.target.value),
    [setField],
  );

  const isDisabled =
    loading || !!formError || Object.values(errors).some(Boolean);

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleEmailInput}
          error={errors.email}
          required
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={values.password}
          onChange={handlePasswordInput}
          minLength={MIN_PASSWORD_LENGTH}
          error={errors.password}
          required
        />
        <Input
          type="password"
          placeholder="Подтвердите пароль"
          value={values.confirm}
          onChange={handleConfirmInput}
          minLength={MIN_PASSWORD_LENGTH}
          error={errors.confirm}
          required
        />
        <button type="submit" disabled={isDisabled}>
          Зарегистрироваться
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Уже зарегистрированы?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Авторизуйтесь
        </Link>
      </p>
    </div>
  );
}
