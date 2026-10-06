"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { addToCart } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/wishlistSlice";
import type { Product } from "@/types";
import { showToast } from "@/components/layout/ToastProvider";

export function ProductActions({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=>state.auth.user);

  return (
    <div className="hero-actions">
      {user? (
        <>
        <button
        className="btn"
        onClick={() => {
          dispatch(addToCart(product));
          showToast({ title: "Added to cart", message: `${product.name} is ready for checkout.` });
        }}
      >
        <ShoppingCart size={18} /> Add to cart
      </button>
      <button
        className="btn secondary"
        onClick={() => {
          dispatch(toggleWishlist(product));
          showToast({ title: "Wishlist updated", message: `${product.name} was saved for later.` });
        }}
      >
        <Heart size={18} /> Wishlist
      </button>
        </>
      ):null}
    </div>
  );
}
