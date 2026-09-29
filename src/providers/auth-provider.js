"use client";

import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { server } from "@/app/api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();

  // Clerk knows whether someone is signed in. It does not know they are an
  // admin — that still lives in Mongo, and still decides what the admin area
  // will show — so the session is only half the answer and /auth/me is the
  // other half.
  //
  // Nothing is cached in localStorage any more. The old provider spent most of
  // its length defending against a hand-edited `role` in storage; with no copy
  // of the session on disk there is nothing left to forge, and that whole
  // branch is gone rather than ported.
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // The provider and the admin layout both ask at once on a cold load. Without
  // sharing one call they race. One in-flight promise, one verdict.
  const inFlight = useRef(null);

  const runVerify = useCallback(async () => {
    if (!isLoaded) return null;

    if (!isSignedIn) {
      setUser(null);
      return null;
    }

    try {
      const { data } = await server.get("/auth/me");
      setUser(data.user);
      return data.user;
    } catch (err) {
      const status = err.response?.status;
      // 401 the session resolves to no account, 403 no longer permitted —
      // either way this session is no use here, so end it rather than leave
      // someone signed in to a front end that cannot speak to the API.
      if (status === 401 || status === 403) {
        setUser(null);
        await signOut();
      }
      return null;
    }
  }, [isLoaded, isSignedIn, signOut]);

  const verify = useCallback(() => {
    if (!inFlight.current) {
      inFlight.current = runVerify().finally(() => {
        inFlight.current = null;
      });
    }
    return inFlight.current;
  }, [runVerify]);

  useEffect(() => {
    if (!isLoaded) return undefined;

    let alive = true;
    verify().finally(() => {
      if (alive) setReady(true);
    });

    return () => {
      alive = false;
    };
  }, [isLoaded, verify]);

  const logout = useCallback(async () => {
    setUser(null);
    await signOut();
    router.push("/");
  }, [signOut, router]);

  return (
    <AuthContext.Provider value={{ user, ready, verify, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
