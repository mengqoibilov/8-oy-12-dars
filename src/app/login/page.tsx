"use client";
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { baseUrl } from '@/utils/url';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(baseUrl + "api/auth", { email, password });
      console.log("Login response:", res.data);

      if (res.data.token) {
        Cookies.set('Token', res.data.token, { expires: 7 });
        router.push("/dashboard");
      } else {
        setError("Login muvaffaqiyatsiz bo'ldi");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setError(error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <nav className="absolute top-0 w-full flex justify-between items-center px-6 py-4 bg-gray-800 bg-opacity-90">
        <h1 className="text-white text-2xl font-bold">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="text-white hover:underline">Developers</Link>
          <Link href="/register" className="text-white hover:underline">Register</Link>
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </div>
      </nav>

      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="p-2 border rounded"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            required
          />
          <button 
            type="submit" 
            className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link href="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
