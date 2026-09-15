"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { server } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validation/login";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

export function LoginForm() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const { data } = await server.post("/auth/login", values);
      login(data.user, data.token);
    } catch (err) {
      setServerError(err.response?.data?.message ?? "Could not log in. Try again.");
    }
  };

  return (
    <>
      <h1 className="text-[32px]">{t("auth.loginTitle")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
        <div>
          <Label htmlFor="login-email">{t("auth.email")}</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            className="mt-1.5"
            {...register("email")}
          />
          <FieldError error={errors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">{t("auth.password")}</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-sugo underline-offset-4 hover:underline"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="mt-1.5"
            {...register("password")}
          />
          <FieldError error={errors.password} />
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {t("action.login")}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {t("auth.noAccount")}{" "}
        <Link href="/signup" className="text-sugo underline-offset-4 hover:underline">
          {t("action.signup")}
        </Link>
      </p>
    </>
  );
}
