"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Send, ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { addToCart } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/wishlistSlice";
import type { Product } from "@/types";
import { showToast } from "@/components/layout/ToastProvider";

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wished = useAppSelector((state) => state.wishlist.items.some((item) => item.id === product.id));
  const user = useAppSelector((state) => state.auth.user);

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    showToast({
      title: wished ? "Removed from wishlist" : "Saved to wishlist",
      message: `${product.name} ${wished ? "was removed." : "is waiting for later."}`
    });
  };

  const handleCart = () => {
    dispatch(addToCart(product));
    showToast({ title: "Added to cart", message: `${product.name} is ready for checkout.` });
  };

  return (
    <article className="product-card glass gsap-reveal">
      <Link href={`/products/${product.id}`} className="product-media">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 100vw, 33vw" />
        <span>{product.badge}</span>
      </Link>
      <div className="product-body">
        <div>
          <p className="muted">{product.category}</p>
          <h3>{product.name}</h3>
        </div>
        <div className="rating">
          <Star size={16} fill="currentColor" /> {product.rating} ({product.reviews})
        </div>
        <p className="muted">{product.description}</p>
        <div className="product-footer">
          <strong>{formatCurrency(product.price)}</strong>
          <div className="product-actions">
            {user? (
              <>
               <button className="icon-btn" onClick={handleWishlist} aria-label="Wishlist">
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
            </button>
            <button className="icon-btn accent" onClick={handleCart} aria-label="Add to cart">
              <ShoppingCart size={18} />
            </button>
              </>
            ):(
              <button className="btn">
              <Send size={18} /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
