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
import { signupSchema } from "@/lib/validation/signup";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

export function SignupForm() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await server.post("/auth/sign-up", { email: values.email, password: values.password });
      const { data } = await server.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      login(data.user);
    } catch (err) {
      setServerError(err.response?.data?.message ?? "Could not create the account. Try again.");
    }
  };

  return (
    <>
      <h1 className="text-[32px]">{t("auth.signupTitle")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
        <div>
          <Label htmlFor="signup-email">{t("auth.email")}</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            className="mt-1.5"
            {...register("email")}
          />
          <FieldError error={errors.email} />
        </div>

        <div>
          <Label htmlFor="signup-password">{t("auth.password")}</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register("password")}
          />
          <FieldError error={errors.password} />
        </div>

        <div>
          <Label htmlFor="signup-confirm">{t("auth.confirm")}</Label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register("confirm")}
          />
          <FieldError error={errors.confirm} />
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {t("action.signup")}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="text-sugo underline-offset-4 hover:underline">
          {t("action.login")}
        </Link>
      </p>
    </>
  );
}
