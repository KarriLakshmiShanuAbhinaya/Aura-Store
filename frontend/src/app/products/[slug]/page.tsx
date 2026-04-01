import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/types";
import { API_URL } from "@/lib/api";

import { ArrowLeft, Check, Truck, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {

      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      const text = await res.text();
      console.error(`Backend returned ${res.status}: ${text.slice(0, 500)}`);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error(`Expected JSON for product ${slug} but got ${contentType}. Body: ${text.slice(0, 500)}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`Fetch error for product ${slug}:`, error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const imageUrl = product.images?.[0] || "/placeholder.png";

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-black w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all products
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Product Image */}
          <div className="aspect-[4/5] sm:aspect-square lg:border lg:border-zinc-200 lg:dark:border-zinc-800 lg:rounded-3xl overflow-hidden relative bg-zinc-100 dark:bg-zinc-900 shadow-sm">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0 lg:py-8">
            <div className="mb-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {product.category?.name || "Uncategorized"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h1>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-3xl tracking-tight text-zinc-900 dark:text-zinc-50 font-medium">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                    In Stock ({product.stockCount})
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-500/10 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-4">
                Description
              </h2>
              <div className="prose prose-sm text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4">
              <AddToCartButton product={product} />
            </div>

            {/* Value Props */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <Truck className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Free shipping</p>
                  <p className="text-xs text-zinc-500">On orders over $150</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <ShieldCheck className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">2-Year Warranty</p>
                  <p className="text-xs text-zinc-500">Full coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
