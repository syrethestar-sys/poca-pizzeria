"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";

// Someone already signed in has no business on login or sign-up. It waits for
// the session to be verified first, so it never fires on a stale cached user.
export function RedirectIfSignedIn() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready || !user) return;
    router.replace(user.role === "admin" ? "/admin/menu" : "/");
  }, [ready, user, router]);

  return null;
}
