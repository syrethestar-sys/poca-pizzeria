"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminTopbar } from "./_components/admin-topbar";

export default function AdminLayout({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user?.role !== "admin") {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || user?.role !== "admin") return null;

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
