"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/interactive/Button";
// import { logout } from "@/libraries/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedUser, setLoggedUser] = useState("User");

  useEffect(() => {
    // This code only runs in the browser
    const user = localStorage.getItem("trusted-farm-id-accounting-app");
    if (user) {
      setLoggedUser(user);
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('trusted-farm-id-accounting-app');
    localStorage.removeItem('authenticated');
    router.push('/login');
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        {pathname !== "/dashboard" ? (
          <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : null}
        <span className="text-gray-600">Hello, {loggedUser}</span>
        <Button onClick={handleLogout} variant="danger">
          Logout
        </Button>
      </header>
      <main className="p-2 min-h-screen">{children}</main>
    </div>
  );
}
