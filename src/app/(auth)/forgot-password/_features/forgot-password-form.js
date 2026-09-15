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
import { forgotPasswordSchema } from "@/lib/validation/forgot-password";
import { useLanguage } from "@/providers/language-provider";

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await server.post("/auth/forgot-password", values);
      setSent(true);
    } catch (err) {
      setServerError(err.response?.data?.message ?? "Could not send the reset link. Try again.");
    }
  };

  if (sent) {
    return (
      <>
        <h1 className="text-[32px]">{t("auth.forgotPasswordTitle")}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t("auth.resetEmailSent")}</p>
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
      <h1 className="text-[32px]">{t("auth.forgotPasswordTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("auth.forgotPasswordLede")}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
        <div>
          <Label htmlFor="forgot-email">{t("auth.email")}</Label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            className="mt-1.5"
            {...register("email")}
          />
          <FieldError error={errors.email} />
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {t("action.sendResetLink")}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/login" className="text-sugo underline-offset-4 hover:underline">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </>
  );
}
