"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminTopbar } from "./_components/admin-topbar";

export default function AdminLayout({ children }) {
  const { user, ready, verify } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  // Entering the admin area always asks the server again, rather than trusting
  // whatever the provider last held. A devtools edit in this same tab fires no
  // storage event, so this is the check that catches it.
  useEffect(() => {
    let alive = true;
    verify().then((trusted) => {
      if (!alive) return;
      // A null verdict means the session was rejected outright and the
      // provider has already sent them to log in again.
      if (trusted && trusted.role !== "admin") router.replace("/");
      setChecked(true);
    });
    return () => {
      alive = false;
    };
  }, [verify, router]);

  // Nothing of the admin UI is painted until the server has confirmed the
  // role — otherwise a forged localStorage entry would flash the panel up
  // before the check came back.
  if (!ready || !checked || user?.role !== "admin") return null;

  return (
    <div className="flex min-h-svh">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 px-4 pb-12 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
