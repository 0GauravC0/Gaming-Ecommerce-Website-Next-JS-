"use client";

import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { useAppSelector } from "@/store/hooks";

export function WishlistView() {
  const items = useAppSelector((state) => state.wishlist.items);

  return (
    <main className="section container">
      <span className="eyebrow">Saved gear</span>
      <h1 className="title">Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty-state glass">
          <h2>No wishlist items yet</h2>
          <p className="muted">Save products for later purchase from the catalog.</p>
          <Link href="/products" className="btn">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
