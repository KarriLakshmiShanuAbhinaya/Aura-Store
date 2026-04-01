"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { API_URL } from "@/lib/api";


export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const shipping = totalPrice > 150 ? 0 : 15;
  const finalTotal = totalPrice + shipping;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch(`${API_URL}/api/checkout`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "customer@example.com", // Mock user
          items: items.map((i) => ({ id: i.product.id, quantity: i.quantity })),
        }),
      });

      if (res.ok) {
        setOrderConfirmed(true);
        clearCart();
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please ensure the backend is running.");
    }
    setIsCheckingOut(false);
  };

  if (orderConfirmed) {
    return (
      <div className="flex-1 bg-zinc-50 dark:bg-black min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center max-w-lg w-full shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">
            Thank you for your purchase. We've sent a confirmation email to
            customer@example.com.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full rounded-full bg-black py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-black min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-7">
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-2 sm:p-6 text-zinc-900 dark:text-white">
                {items.map((item) => (
                  <li key={item.product.id} className="flex py-6 px-2 sm:px-0">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 sm:h-32 sm:w-32 relative">
                      <Image
                        src={item.product.images?.[0] || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-base sm:text-lg font-bold">
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="hover:text-emerald-600 dark:hover:text-emerald-400"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">
                            {item.product.category?.name || "Uncategorized"}
                          </p>
                          <p className="mt-1 text-base font-medium">
                            ${item.product.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full w-fit">
                            <button
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-2 text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="absolute top-0 right-0 sm:top-0 sm:right-0">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="inline-flex p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white mt-8 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="mt-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 px-6 py-8 sm:p-10 lg:col-span-5 lg:mt-0 shadow-sm border border-transparent dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Order Summary
              </h2>

              <dl className="mt-8 space-y-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-zinc-900 dark:text-white text-base">
                    ${totalPrice.toFixed(2)}
                  </dd>
                </div>
                
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <dt className="flex items-center">
                    <span>Shipping estimate</span>
                  </dt>
                  <dd className="text-zinc-900 dark:text-white text-base">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6 text-lg font-bold">
                  <dt className="text-zinc-900 dark:text-white">Order total</dt>
                  <dd className="text-zinc-900 dark:text-white">
                    ${finalTotal.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full rounded-full bg-black py-5 text-base font-bold text-white shadow-lg transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
              <p className="mt-6 text-center text-xs text-zinc-500">
                Taxes are calculated at checkout. Ships securely.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
