"use client";

import Link from "next/link";
import { MapPin, PackageCheck } from "lucide-react";
import { addresses, orders } from "@/lib/products";
import { useAppSelector } from "@/store/hooks";

export function AccountView() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <main className="section container">
        <div className="empty-state glass">
          <h1>Login required</h1>
          <p className="muted">Create an account to view orders, track deliveries, and manage addresses.</p>
          <Link href="/auth" className="btn">
            Login / Register
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section container">
      <span className="eyebrow">Account</span>
      <h1 className="title">{user.email}</h1>
      <div className="account-grid">
        <section className="glass account-panel">
          <PackageCheck size={24} />
          <h2>Order history</h2>
          {orders.map((order) => (
            <div className="data-row" key={order.id}>
              <span>{order.id}</span>
              <strong>{order.status}</strong>
              <span>{order.date}</span>
            </div>
          ))}
        </section>
        <section className="glass account-panel">
          <MapPin size={24} />
          <h2>Addresses</h2>
          {addresses.map((address) => (
            <div className="address-card" key={address.id}>
              <strong>{address.label}</strong>
              <p className="muted">{address.line}, {address.city}</p>
              <span>{address.phone}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
