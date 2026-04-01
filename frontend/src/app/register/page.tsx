"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";


export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState(""); // For testing UI

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setUserId(data.userId);
        setSimulatedOtp(data.otp);
        setStep(2);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Registration failed. Backend unreachable?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Verified! Please login.");
        router.push("/login");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
            {step === 1 ? "Create Account" : "Verify OTP"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {step === 1 
              ? "Join our community as a customer or seller" 
              : `We've sent a code to ${formData.email}`}
          </p>
        </div>

        {error && (
          <div className="mx-8 mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="px-8 pb-10 space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Register As</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
                  className={`py-3 rounded-xl text-sm font-bold border ${formData.role === "CUSTOMER" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "SELLER" })}
                  className={`py-3 rounded-xl text-sm font-bold border ${formData.role === "SELLER" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"}`}
                >
                  Seller
                </button>
              </div>
            </div>

            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

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
              <Phone className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {isLoading ? "Signing up..." : <>Register <ArrowRight className="ml-2 h-5 w-5" /></>}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account? <Link href="/login" className="text-emerald-600 font-bold">Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="px-8 pb-10 space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-xl">
              <p className="text-sm text-emerald-800 dark:text-emerald-400 text-center font-medium">
                Simulated OTP: <span className="font-bold underline">{simulatedOtp}</span>
              </p>
            </div>
            
            <div className="relative text-center">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-3xl tracking-widest py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {isLoading ? "Verifying..." : <>Verify & Complete <CheckCircle2 className="ml-2 h-5 w-5" /></>}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-zinc-500 font-medium">
              Back to details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
