"use client";
import { ChevronLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/interactive/Button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToastError } from "@/hooks/Toast";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedUser, setLoggedUser] = useState<string>("No User");
  const [roles, setRoles] = useState<string>("No Roles");
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const showErrorToast = useToastError();

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/get-session", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          const session = await response.json();
          setLoggedUser(session.data.username);
          setRoles(session.data.role);
        } else {
          showErrorToast(`Failed to fetch session: ${await response.text()}`);
        }
      } catch (error) {
        showErrorToast(`Error fetching session: ${error}`);
      } finally {
        setLoadingData(false);
      }
    }
    fetchSession();
  }, [showErrorToast]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("trusted-farm-id-accounting-app-username");
    localStorage.removeItem("trusted-farm-id-accounting-app-authenticated");
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 flex justify-between items-center h-20 bg-blue-400 shadow px-4 py-3 z-10">
        <div className="flex gap-3 text-left">
          {pathname !== "/dashboard" ? (
            <Link href="/dashboard" className="flex items-center gap-2 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-white hover:text-gray-200" />
            </Link>
          ) : null}
          <div>
            <p className="text-white">{loadingData ? "Loading..." : loggedUser}</p>
            <p className="text-white text-sm italic">{loadingData ? "Loading..." : roles.split(",").join(", ")}</p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="transparent">
          <LogOut className="w-5 h-5 text-white hover:text-red-400" />
        </Button>
      </header>
      <main className="p-4 max-h-[calc(100vh-10rem)]">{children}</main>
    </>
  );
}
