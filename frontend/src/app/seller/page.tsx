"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";


export default function SellerDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockCount: "",
    categoryId: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "SELLER")) {
      router.push("/login?role=seller");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)

      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      })
      .catch((err) => console.error("Error in categories effect:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/products`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sellerId: user.id }),
      });

      if (res.ok) {
        alert("Product saved successfully!");
        router.push("/");
      } else {
        alert("Failed to save product.");
      }
    } catch (error) {
      alert("Error saving product.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== "SELLER") return null;

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-[80vh] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to storefront
        </Link>

        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Seller Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Welcome {user.name}. Add a new product to your store. It will instantly be available to customers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors"
                placeholder="e.g. Aura Pro Earbuds"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors resize-none"
                placeholder="Describe your product..."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Price ($)
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-zinc-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-8 pr-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors"
                    placeholder="299.99"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stockCount" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Stock Count
                </label>
                <input
                  type="number"
                  id="stockCount"
                  name="stockCount"
                  min="0"
                  step="1"
                  required
                  value={formData.stockCount}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-colors"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" /> Save Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
