"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ClipboardList,
  PackagePlus,
  Settings,
  Shield,
  Star,
  Users
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { orders as seedOrders, products as seedProducts, reviews as seedReviews } from "@/lib/products";
import {
  createProduct,
  deleteProductById,
  getOrders,
  getProducts,
  getReviews,
  moderateReview,
  updateOrderStatus,
  updateProductStock
} from "@/lib/supabaseData";
import { useAppSelector } from "@/store/hooks";
import type { OrderStatus, Product } from "@/types";

export function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState(seedOrders);
  const [reviews, setReviews] = useState(seedReviews);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (!user) router.push("/auth");
    if (user?.role === "customer") router.push("/");
  }, [router, user]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    getProducts().then(setProducts);
    getOrders().then(setOrders);
    getReviews().then(setReviews);
  }, [user?.role]);

  const stats = useMemo(
    () => ({
      sales: orders.reduce((total, order) => total + order.total, 0),
      orders: orders.length,
      inventory: products.reduce((total, product) => total + product.stock, 0),
      lowStock: products.filter((product) => product.stock <= 5).length
    }),
    [orders, products]
  );

  if (user?.role !== "admin") {
    return (
      <main className="section container">
        <div className="empty-state glass">
          <h1>Admin access only</h1>
          <p className="muted">Login with the configured admin email to open the dashboard.</p>
          <Link href="/auth" className="btn">Go to login</Link>
        </div>
      </main>
    );
  }

  const updateOrder = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
    updateOrderStatus(id, status);
  };

  const updateStock = (id: string, stock: number) => {
    setProducts((current) => current.map((product) => (product.id === id ? { ...product, stock } : product)));
    updateProductStock(id, stock);
  };

  const confirmDeleteProduct = () => {
    if (!pendingDelete) return;
    setProducts((current) => current.filter((product) => product.id !== pendingDelete.id));
    deleteProductById(pendingDelete.id);
    setPendingDelete(null);
  };

  const addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product: Product = {
      id: String(Date.now()),
      name: String(form.get("name")),
      category: "Gaming Accessories",
      price: Number(form.get("price")),
      rating: 4.2,
      reviews: 0,
      stock: Number(form.get("stock")),
      badge: "New",
      description: String(form.get("description")),
      image: String(form.get("image")) || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      tags: ["New"],
      popularity: 70
    };
    setProducts((current) => [product, ...current]);
    createProduct(product);
    event.currentTarget.reset();
  };

  return (
    <main className="section container">
      <span className="eyebrow">Admin panel</span>
      <h1 className="title">Dashboard</h1>
      <div className="admin-stats">
        <Stat icon={<CheckCircle2 />} label="Sales" value={formatCurrency(stats.sales)} />
        <Stat icon={<ClipboardList />} label="Orders" value={String(stats.orders)} />
        <Stat icon={<Boxes />} label="Inventory" value={String(stats.inventory)} />
        <Stat icon={<AlertTriangle />} label="Low stock" value={String(stats.lowStock)} />
      </div>

      <div className="admin-grid">
        <section className="glass admin-panel wide">
          <div className="panel-title">
            <PackagePlus size={22} />
            <h2>Product management</h2>
          </div>
          <form className="admin-form" onSubmit={addProduct}>
            <input name="name" placeholder="Product name" required />
            <input name="price" placeholder="Price" type="number" required />
            <input name="stock" placeholder="Stock" type="number" required />
            <input name="image" placeholder="Image URL" type="url" />
            <input name="description" placeholder="Description" required />
            <button className="btn">Add product</button>
          </form>
          <div className="admin-product-list">
            {products.map((product) => (
              <div className="data-row" key={product.id}>
                <span>{product.name}</span>
                <strong>{formatCurrency(product.price)}</strong>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(event) => updateStock(product.id, Number(event.target.value))}
                  aria-label={`Stock for ${product.name}`}
                />
                <button className="btn secondary" onClick={() => setPendingDelete(product)}>Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass admin-panel">
          <div className="panel-title">
            <ClipboardList size={22} />
            <h2>Order management</h2>
          </div>
          {orders.map((order) => (
            <div className="data-row" key={order.id}>
              <span>{order.id}</span>
              <strong>{order.user}</strong>
              <select value={order.status} onChange={(event) => updateOrder(order.id, event.target.value as OrderStatus)}>
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
            </div>
          ))}
        </section>

        <section className="glass admin-panel">
          <div className="panel-title">
            <Users size={22} />
            <h2>User management</h2>
          </div>
          {["Aarav Mehta", "Priya Nair", "Rohan Das"].map((customer) => (
            <div className="data-row" key={customer}>
              <span>{customer}</span>
              <strong>Active</strong>
            </div>
          ))}
        </section>

        <section className="glass admin-panel">
          <div className="panel-title">
            <Star size={22} />
            <h2>Review moderation</h2>
          </div>
          {reviews.map((review) => (
            <div className="data-row" key={review.id}>
              <span>{review.customer}: {review.rating}/5</span>
              <select
                value={review.status}
                onChange={(event) =>
                  setReviews((current) =>
                    current.map((item) =>
                      item.id === review.id ? { ...item, status: event.target.value as "Pending" | "Approved" | "Rejected" } : item
                    )
                  )
                }
                onBlur={(event) => moderateReview(review.id, event.target.value as "Pending" | "Approved" | "Rejected")}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          ))}
        </section>

        <section className="glass admin-panel">
          <div className="panel-title">
            <Settings size={22} />
            <h2>Settings</h2>
          </div>
          <div className="data-row"><span>Payment method</span><strong>Manual / Stripe ready</strong></div>
          <div className="data-row"><span>Tax rate</span><strong>18% GST</strong></div>
          <div className="data-row"><span>Shipping</span><strong>Free over ₹10,000</strong></div>
        </section>

        <section className="glass admin-panel">
          <div className="panel-title">
            <Shield size={22} />
            <h2>Customer queries</h2>
          </div>
          <div className="data-row"><span>Warranty question</span><strong>Open</strong></div>
          <div className="data-row"><span>Delivery ETA</span><strong>Resolved</strong></div>
        </section>
      </div>
      {pendingDelete ? (
        <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-product-title">
          <div className="confirm-modal glass">
            <span className="eyebrow">Confirm delete</span>
            <h2 id="delete-product-title">Delete this product?</h2>
            <p className="muted">
              Are you sure you want to delete <strong>{pendingDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn secondary" onClick={() => setPendingDelete(null)}>Cancel</button>
              <button className="btn danger" onClick={confirmDeleteProduct}>Delete product</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass stat-card">
      {icon}
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
