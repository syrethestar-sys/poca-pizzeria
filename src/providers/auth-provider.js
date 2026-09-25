"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { server } from "@/app/api/api";

const AuthContext = createContext(null);

const readStored = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // The provider and the admin layout both ask at once on a cold load. Without
  // sharing one call they race: the first corrects the forged record, the
  // second then reads the corrected one, sees nothing wrong, and puts the
  // session back. One in-flight promise, one verdict.
  const inFlight = useRef(null);

  const clearSession = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err) {
      console.error(err);
    }
  }, []);

  // localStorage belongs to whoever is sitting at the browser, so nothing in
  // it can be trusted — least of all `role`. The stored copy is a cache; this
  // asks the server who the token actually belongs to and believes only that.
  const runVerify = useCallback(async () => {
    let token = null;
    try {
      token = localStorage.getItem("token");
    } catch (err) {
      console.error(err);
    }

    if (!token) {
      clearSession();
      return null;
    }

    try {
      const { data } = await server.get("/auth/me");
      const trusted = data.user;
      const claimed = readStored();

      // Someone edited their way into a role they do not hold — or a real
      // admin has since been demoted. Either way: write the true record back
      // over the forged one, end the session, and make them sign in again.
      if (claimed && claimed.role !== trusted.role) {
        setUser(null);
        try {
          localStorage.setItem("user", JSON.stringify(trusted));
          localStorage.removeItem("token");
        } catch (err) {
          console.error(err);
        }
        router.replace("/login?session=rejected");
        return null;
      }

      setUser(trusted);
      try {
        localStorage.setItem("user", JSON.stringify(trusted));
      } catch (err) {
        console.error(err);
      }
      return trusted;
    } catch (err) {
      const status = err.response?.status;
      // 401 expired or forged, 403 no longer permitted — either way, out.
      if (status === 401 || status === 403) {
        clearSession();
        router.replace("/login?session=expired");
      }
      return null;
    }
  }, [clearSession, router]);

  const verify = useCallback(() => {
    if (!inFlight.current) {
      inFlight.current = runVerify().finally(() => {
        inFlight.current = null;
      });
    }
    return inFlight.current;
  }, [runVerify]);

  useEffect(() => {
    let alive = true;
    verify().finally(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [verify]);

  // Editing storage in another tab fires this one. Same-tab devtools edits do
  // not, which is why the admin layout re-verifies on entry as well.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "user" || event.key === "token") verify();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [verify]);

  const login = (userData, token) => {
    setUser(userData);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      if (token) localStorage.setItem("token", token);
    } catch (err) {
      console.error(err);
    }
    router.push(userData.role === "admin" ? "/admin/menu" : "/");
  };

  const logout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, verify }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
