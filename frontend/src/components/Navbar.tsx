"use client";

import Link from "next/link";
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
      </div>
      <input
        type="text"
        name="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="block w-full pl-10 pr-10 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-emerald-500/10 rounded-xl transition-all outline-none text-zinc-900 dark:text-zinc-100"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            router.push("/");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="w-full border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center gap-4">
          <div className="flex items-center gap-8 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tighter text-emerald-600 dark:text-emerald-500">
                AURA
              </span>
            </Link>
            <div className="hidden lg:flex gap-6 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
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

          {/* Search Bar - Professional Look with Suspense for Vercel fix */}
          <div className="flex-1 max-w-md hidden md:block">
            <Suspense fallback={
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="block w-full h-8 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
              </div>
            }>
              <SearchBar />
            </Suspense>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
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
