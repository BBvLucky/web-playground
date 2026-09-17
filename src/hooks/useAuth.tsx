"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { getUserFriendlyError } from "@/lib/authErrorMessages";
import {
  validateEmail,
  validatePassword,
  validateConfirm,
} from "@/lib/validators";

type Field = "email" | "password" | "confirm";
type Errors = Record<Field, string | null>;

const emptyErrors: Errors = { email: null, password: null, confirm: null };

export function useAuth(mode: "login" | "register") {
  const router = useRouter();
  const supabase = createClient();

  const [values, setValues] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setField(field: Field, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setFormError(null);
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setFormError(null);

    const newErrors: Errors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm:
        mode === "register"
          ? validateConfirm(values.password, values.confirm)
          : null,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    const { error } = await (mode === "register"
      ? supabase.auth.signUp({ email: values.email, password: values.password })
      : supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        }));

    if (error) {
      const userFriendlyError = getUserFriendlyError(error);
      setFormError(userFriendlyError);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return { values, errors, formError, loading, setField, handleSubmit };
}
