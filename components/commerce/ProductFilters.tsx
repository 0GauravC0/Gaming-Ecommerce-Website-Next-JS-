"use client";

import { Search } from "lucide-react";
import { categories } from "@/lib/products";

type Props = {
  query: string;
  category: string;
  sort: string;
  maxPrice: number;
  minRating: number;
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onSort: (value: string) => void;
  onMaxPrice: (value: number) => void;
  onMinRating: (value: number) => void;
};

export function ProductFilters(props: Props) {
  return (
    <aside className="filters glass gsap-reveal">
      <div>
        <span className="eyebrow">Filters</span>
        <h2>Refine gear</h2>
      </div>
      <label className="field search-field">
        Search
        <Search size={18} />
        <input value={props.query} onChange={(event) => props.onQuery(event.target.value)} placeholder="Search gear" />
      </label>
      <label className="field">
        Category
        <select value={props.category} onChange={(event) => props.onCategory(event.target.value)}>
          <option>All</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label className="field">
        Sort
        <select value={props.sort} onChange={(event) => props.onSort(event.target.value)}>
          <option value="popular">Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </label>
      <label className="field">
        Max price: ₹{props.maxPrice.toLocaleString("en-IN")}
        <input
          type="range"
          min="5000"
          max="300000"
          step="5000"
          value={props.maxPrice}
          onChange={(event) => props.onMaxPrice(Number(event.target.value))}
        />
      </label>
      <label className="field">
        Min rating
        <select value={props.minRating} onChange={(event) => props.onMinRating(Number(event.target.value))}>
          <option value={0}>Any</option>
          <option value={4}>4+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </label>
    </aside>
  );
}
