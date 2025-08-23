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
    const user = localStorage.getItem("trusted-farm-id-accounting-app-username");
    if (user) {
      setLoggedUser(user);
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("trusted-farm-id-accounting-app-username");
    localStorage.removeItem("trusted-farm-id-accounting-app-authenticated");
    router.push("/login");
  };

  return (
    <div className="flex-1 flex flex-col">
      <header>
        <div className="flex justify-between items-center bg-blue-400 shadow px-4 py-3 relative z-10">
          {pathname !== "/dashboard" ? (
            <Link href="/dashboard" className="flex items-center gap-2 rounded-lg hover:bg-gray-200 transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          ) : null}
          <div className="text-right">
            <p className="text-black">{loggedUser}</p>
            <p className="text-white text-sm">{loggedUser}</p>
          </div>
        </div>
        <div className="flex justify-between items-center bg-white shadow px-4 py-2 relative z-0 ">
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </header>
      <main className="p-4 min-h-screen">{children}</main>
    </div>
  );
}
