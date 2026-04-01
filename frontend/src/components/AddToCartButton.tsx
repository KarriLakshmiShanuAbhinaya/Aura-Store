"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!product.inStock}
      className={`w-full rounded-full py-5 text-base font-bold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? "bg-emerald-500 text-white focus:ring-emerald-500 hover:bg-emerald-600"
          : "bg-black text-white focus:ring-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      }`}
    >
      {added ? (
        <span className="flex items-center justify-center gap-2">
          <Check className="h-5 w-5" /> Added to Cart
        </span>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
