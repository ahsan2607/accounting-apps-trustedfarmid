// ./src/app/login/page.tsx (Next.js)
"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { checkLogin } from '@/libraries/api';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const response = await checkLogin(username, password);
    if (response.success && response.data) {
      // Set session cookie via fetch to a new API route
      const sessionData = {
        authenticated: true,
        coaID: response.data.coaID,
        username: response.data.username,
        loginTime: new Date().toISOString(),
      };
      const setSessionRes = await fetch('/api/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      if (setSessionRes.ok) {
        localStorage.setItem('trusted-farm-id-accounting-app-username', username);
        localStorage.setItem('trusted-farm-id-accounting-app-authenticated', 'true');
        router.push('/dashboard');
      } else {
        setError('Session setup failed');
      }
    } else {
      setError(response.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
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
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}