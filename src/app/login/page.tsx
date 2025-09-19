// ./src/app/login/page.tsx (Next.js)
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/libraries/api";
import { useToastError, useToastSuccess } from "@/hooks/Toast";
import { Visual } from "@/components/atoms";
import { ToastContainer } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const showSuccessToast = useToastSuccess();
  const showErrorToast = useToastError();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await checkLogin(username, password);
    if (response.success && response.data) {
      const sessionData = {
        authenticated: true,
        id: response.data.id,
        username: response.data.username,
        role: response.data.role,
        accessibleAccounts: response.data.accessibleAccounts,
        loginTime: new Date().toISOString(),
      };
      const setSessionRes = await fetch("/api/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (setSessionRes.ok && response.success) {
        setLoading(false);
        showSuccessToast("Login successful");
        localStorage.setItem("trusted-farm-id-accounting-app-username", username);
        localStorage.setItem("trusted-farm-id-accounting-app-authenticated", "true");
        router.push("/dashboard");
      } else {
        setLoading(false);
        showErrorToast(response.error || "Login failed");
      }
    } else {
      setLoading(false);
      showErrorToast(response.error || "Login failed");
    }
  };

  // if (loading)
  //   return (
  //     <>
  //       <Visual.Spinner />
  //       <ToastContainer position="bottom-right" className="gap-2 md:gap-0 p-2 md:p-0" autoClose={3000} />
  //     </>
  //   );

  return (
    <div className="max-w-md mx-auto p-4">
      {!loading ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Accounting App Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full">
              Login
            </button>
          </form>
        </>
      ) : (
        <Visual.Spinner />
      )}
      <ToastContainer position="bottom-right" className="gap-2 md:gap-0 p-2 md:p-0" autoClose={3000} />
    </div>
  );
}
