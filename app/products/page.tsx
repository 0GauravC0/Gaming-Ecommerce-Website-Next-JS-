import { Suspense } from "react";
import { ProductGrid } from "@/components/commerce/ProductGrid";

export default function ProductsPage() {
  return (
    <main className="section container">
      <span className="eyebrow">Catalog</span>
      <h1 className="title">Gaming products</h1>
      <p className="muted page-intro">Search, filter, and sort by category, price, rating, and popularity.</p>
      <Suspense fallback={<div className="glass empty-state">Loading products...</div>}>
        <ProductGrid />
      </Suspense>
    </main>
  );
}
