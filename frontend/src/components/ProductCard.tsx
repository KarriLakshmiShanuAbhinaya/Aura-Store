import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use the first image if it exists, otherwise a placeholder
  const imageUrl = product.images?.[0] || "/placeholder.png";

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-100 transition-all hover:shadow-xl dark:bg-zinc-950 dark:border-zinc-800">
        <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {product.category?.name || "Uncategorized"}
              </span>
              {!product.inStock && (
                <span className="text-xs font-bold text-red-500">Out of Stock</span>
              )}
            </div>
            <h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
              ${product.price.toFixed(2)}
            </p>
            <span className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-zinc-800 dark:bg-white dark:text-black dark:group-hover:bg-zinc-200">
              View Item
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
