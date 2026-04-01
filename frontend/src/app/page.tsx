import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:5000/api/products", {
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Backend returned ${res.status}: ${text.slice(0, 500)}`);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error(`Expected JSON but got ${contentType}. Body: ${text.slice(0, 500)}`);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Fetch error in getProducts:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black pb-24">
      {/* Hero Section */}
      <section className="w-full relative bg-zinc-950 flex items-center justify-center pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
          {/* Subtle noise and gradient overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 font-medium mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            Aura Premium Collection 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Everyday</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 text-balance leading-relaxed">
            Discover a curated selection of premium electronics and minimalist office essentials designed to enhance your lifestyle and productivity.
          </p>
          <a
            href="#featured"
            className="rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95"
          >
            Shop the Collection
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:-mt-16 z-20 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Featured Products
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Our most popular items handpicked for you.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No products found</h3>
            <p className="text-zinc-500">Please make sure the backend server (Express) is running on port 5000.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
