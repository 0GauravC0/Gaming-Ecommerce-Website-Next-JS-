import Link from "next/link";
import { Mail, MapPin, ShieldCheck, Truck } from "lucide-react";
import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            SteelTech
          </Link>
          <p className="muted">Gaming laptops, monitors, accessories, mice, setups, and custom PC builds for players who care about the full desk.</p>
        </div>
        <div>
          <h3>Categories</h3>
          {categories.map((category) => (
            <Link href={`/products?category=${encodeURIComponent(category)}`} key={category}>
              {category}
            </Link>
          ))}
        </div>
        <div>
          <h3>Support</h3>
          <Link href="/account">Order tracking</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Checkout</Link>
          <Link href="/auth">Login</Link>
        </div>
        <div>
          <h3>Store promise</h3>
          <p><Truck size={16} /> Fast delivery options</p>
          <p><ShieldCheck size={16} /> Warranty-ready products</p>
          <p><MapPin size={16} /> India presentation demo</p>
          <p><Mail size={16} /> support@gameforge.test</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 SteelTech Ecommerce</span>
        <span>Built with Next.js, Redux Toolkit, Yup, React Hook Form, Supabase, and GSAP.</span>
      </div>
    </footer>
  );
}
