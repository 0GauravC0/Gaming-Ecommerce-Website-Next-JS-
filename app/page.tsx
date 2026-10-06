import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Gamepad2, Headphones, Monitor, Mouse, Sparkles } from "lucide-react";
import { Newsletter } from "@/components/commerce/Newsletter";
import { ProductCard } from "@/components/commerce/ProductCard";
import { categories, products } from "@/lib/products";

const categoryIcons = [Cpu, Monitor, Headphones, Mouse, Gamepad2, Sparkles];

const categoryImages = {
  "Gaming Laptop": products.find((product) => product.category === "Gaming Laptop")?.image,
  "Gaming Monitors": products.find((product) => product.category === "Gaming Monitors")?.image,
  "Gaming Accessories": products.find((product) => product.category === "Gaming Accessories")?.image,
  "Gaming Mouse": products.find((product) => product.category === "Gaming Mouse")?.image,
  "Gaming Setups": products.find((product) => product.category === "Gaming Setups")?.image,
  "PC Builds": products.find((product) => product.category === "PC Builds")?.image
};

export default function HomePage() {
  const featured = products.filter((product) => product.badge === "Featured").slice(0, 4);
  const trending = products.filter((product) => product.badge === "Trending").slice(0, 4);
  const deals = products.filter((product) => product.badge === "Top Deal").slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy gsap-reveal">
            <span className="eyebrow">Gaming tech store</span>
            <h1 className="title">The easiest way to shop gaming gear.</h1>
            <p className="muted">
              Curated gaming laptops, monitors, mice, accessories, complete setups, and custom PC builds with smart
              filters and a clean storefront made for presentation.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn">
                Browse products <ArrowRight size={18} />
              </Link>
              <Link href="/products?category=PC%20Builds" className="btn secondary">
                Explore PC builds
              </Link>
            </div>
          </div>
          <div className="hero-showcase gsap-reveal">
            <Image src={products[0].image} alt={products[0].name} fill priority sizes="(max-width: 760px) 100vw, 46vw" />
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head gsap-reveal">
          <div>
            <span className="eyebrow">Categories</span>
            <h2>Shop by setup need</h2>
          </div>
          <Link href="/products" className="btn secondary">View catalog</Link>
        </div>
        <div className="category-grid category-image-grid">
          {categories.map((category, index) => {
            const Icon = categoryIcons[index];
            return (
              <Link href={`/products?category=${encodeURIComponent(category)}`} className="category-card glass gsap-reveal" key={category}>
                <Image src={categoryImages[category] ?? products[0].image} alt={category} fill sizes="(max-width: 760px) 100vw, 33vw" />
                <span>{category}</span>
                <small>{products.filter((product) => product.category === category).length} products</small>
                <Icon size={22} />
              </Link>
            );
          })}
        </div>
      </section>

      <ProductSection title="Trending products" eyebrow="Popular now" products={trending} href="/products?sort=popular" />
      <ProductSection title="Top deals" eyebrow="Save more" products={deals} href="/products" />
      <ProductSection title="Featured products" eyebrow="Curated for you" products={featured} href="/products" />

      <Newsletter />
    </main>
  );
}

function ProductSection({ title, eyebrow, products: sectionProducts, href }: { title: string; eyebrow: string; products: typeof products; href: string }) {
  return (
    <section className="section container">
      <div className="section-head gsap-reveal">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link href={href} className="btn secondary">
          View all
        </Link>
      </div>
      <div className="product-grid">
        {sectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
