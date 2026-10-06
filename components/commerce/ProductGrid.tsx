"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductFilters } from "@/components/commerce/ProductFilters";
import { categories, products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/supabaseData";

const pageSize = 12;

export function ProductGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(fallbackProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [category, maxPrice, minRating, query, sort]);

  const filtered = useMemo(() => {
    return products
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => product.price <= maxPrice)
      .filter((product) => product.rating >= minRating)
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return b.popularity - a.popularity;
      });
  }, [category, maxPrice, minRating, products, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selectedCount = category === "All" ? products.length : products.filter((product) => product.category === category).length;

  return (
    <div className="catalog-layout">
      <section className="catalog-results">
        <div className="category-strip gsap-reveal">
          <button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>
            All <span>{products.length}</span>
          </button>
          {categories.map((item) => (
            <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>
              {item} <span>{products.filter((product) => product.category === item).length}</span>
            </button>
          ))}
        </div>

        <div className="catalog-meta gsap-reveal">
          <div>
            <span className="eyebrow">{category === "All" ? "All categories" : category}</span>
            <h2>{selectedCount} products available</h2>
          </div>
          <p className="muted">
            Showing page {page} of {totalPages}
          </p>
        </div>

        <div className="product-grid catalog-product-grid">
          {pageItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state glass">No products matched your filters.</div>
        ) : (
          <div className="pagination gsap-reveal">
            <button className="btn secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                className={page === index + 1 ? "active" : ""}
                key={index + 1}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn secondary"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <ProductFilters
        query={query}
        category={category}
        sort={sort}
        maxPrice={maxPrice}
        minRating={minRating}
        onQuery={setQuery}
        onCategory={setCategory}
        onSort={setSort}
        onMaxPrice={setMaxPrice}
        onMinRating={setMinRating}
      />
    </div>
  );
}
