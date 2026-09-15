import { ResetPasswordForm } from "./_features/reset-password-form";

export const metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";
  const email = typeof params?.email === "string" ? params.email : "";

  return <ResetPasswordForm token={token} email={email} />;
}
