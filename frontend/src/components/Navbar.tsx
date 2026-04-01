"use client";

import Link from "next/link";
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="w-full border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tighter text-emerald-600 dark:text-emerald-500">
                AURA
              </span>
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                Explore
              </Link>
              {user?.role === "SELLER" && (
                <Link href="/seller" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 text-emerald-600">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/cart" className="p-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button 
                  onClick={logout}
                  className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-xs font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
