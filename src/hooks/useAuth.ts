"use client";
import { User } from '@/interface/User';
import { baseUrl } from '@/utils/url';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); 

  async function getMe() {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get(baseUrl + "auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User Data:", res.data);
      setUser(res.data);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe();
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(baseUrl + "auth", { email, password });

      console.log("Login Response:", res);

      if (res.status === 200) {
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        router.push("/dashboard");
      } else {
        setError("Noto‘g‘ri javob keldi.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      setLoading(true);
      setError("");

     
      const res = await axios.post(
        baseUrl + "users",
       
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      

      console.log("Register Response:", res);

      if (res.data && res.data.token) {
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        router.push("/dashboard");
      } else {
        setError("Registratsiya muvaffaqiyatsiz.");
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }
 
  function logOut() {
    localStorage.removeItem('token');
    setUser(null);
    router.push("/login");
  }

  return { login, register, logOut, user, error, loading };
}

export default useAuth;
