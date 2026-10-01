"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useT } from "next-i18next/client";

import Input from "@/components/Input";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/hooks/useAuth";
import { MIN_PASSWORD_LENGTH } from "@/consts";

function RegisterPage() {
  const { t } = useT("authorization");
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
      <h1>{t("registration.title")}</h1>
      {formError && <ErrorAlert message={formError} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder={t("registration.emailPlaceholder")}
          value={values.email}
          onChange={handleEmailInput}
          error={errors.email}
          required
        />
        <Input
          type="password"
          placeholder={t("registration.passwordPlaceholder")}
          value={values.password}
          onChange={handlePasswordInput}
          minLength={MIN_PASSWORD_LENGTH}
          error={errors.password}
          required
        />
        <Input
          type="password"
          placeholder={t("registration.confirmPasswordPlaceholder")}
          value={values.confirm}
          onChange={handleConfirmInput}
          minLength={MIN_PASSWORD_LENGTH}
          error={errors.confirm}
          required
        />
        <button type="submit" disabled={isDisabled}>
          {t("registration.registerButton")}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {t("registration.alreadyHaveAccount")}
        <Link href="/login" className="text-blue-600 hover:underline">
          {t("registration.loginLink")}
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
