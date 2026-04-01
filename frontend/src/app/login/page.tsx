"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ShieldCheck, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        if (role === "SELLER") {
          router.push("/seller");
        } else {
          router.push("/");
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Login failed. Backend unreachable?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Select your account type to continue</p>
        </div>

        <div className="px-8 mb-6">
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
            <button
              onClick={() => setRole("CUSTOMER")}
              className={`flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${role === "CUSTOMER" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              <UserIcon className="mr-2 h-4 w-4" /> Customer
            </button>
            <button
              onClick={() => setRole("SELLER")}
              className={`flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${role === "SELLER" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Seller
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-8 mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center text-white ${role === 'SELLER' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'}`}
          >
            {isLoading ? "Logging in..." : <>Sign In as {role === 'SELLER' ? 'Seller' : 'Customer'} <ArrowRight className="ml-2 h-5 w-5" /></>}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account? <Link href="/register" className="text-emerald-600 font-bold">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
