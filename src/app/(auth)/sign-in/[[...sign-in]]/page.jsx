import { SignIn } from "@clerk/nextjs";

// The surrounding layout already supplies the logo, the centred column and the
// oven panel, so this only needs the card itself.
export default function SignInPage() {
  return <SignIn />;
}
