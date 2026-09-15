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
import { resetPasswordSchema } from "@/lib/validation/reset-password";
import { useLanguage } from "@/providers/language-provider";

export function ResetPasswordForm({ token, email }) {
  const { t } = useLanguage();
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await server.post("/auth/reset-password", { email, token, password: values.password });
      setDone(true);
    } catch (err) {
      setServerError(err.response?.data?.message ?? "Could not update the password. Try again.");
    }
  };

  if (!token || !email) {
    return (
      <>
        <h1 className="text-[32px]">{t("auth.resetPasswordTitle")}</h1>
        <p className="mt-4 text-sm text-destructive">{t("auth.invalidResetLink")}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/forgot-password" className="text-sugo underline-offset-4 hover:underline">
            {t("auth.forgotPassword")}
          </Link>
        </p>
      </>
    );
  }

  if (done) {
    return (
      <>
        <h1 className="text-[32px]">{t("auth.resetPasswordTitle")}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t("auth.resetSuccess")}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-sugo underline-offset-4 hover:underline">
            {t("auth.backToLogin")}
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[32px]">{t("auth.resetPasswordTitle")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
        <div>
          <Label htmlFor="reset-password">{t("auth.newPassword")}</Label>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register("password")}
          />
          <FieldError error={errors.password} />
        </div>

        <div>
          <Label htmlFor="reset-confirm">{t("auth.confirm")}</Label>
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register("confirm")}
          />
          <FieldError error={errors.confirm} />
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {t("action.resetPassword")}
        </Button>
      </form>
    </>
  );
}
