"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { placeSupabaseOrder } from "@/lib/supabaseData";
import { clearCart, removeFromCart, updateQuantity } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showToast } from "@/components/layout/ToastProvider";

export function CartView() {
  const [ordered, setOrdered] = useState(false);
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const placeOrder = async () => {
    await placeSupabaseOrder(user?.id, items);
    setOrdered(true);
    dispatch(clearCart());
    showToast({ title: "Order placed", message: "Your order was created successfully." });
  };

  return (
    <main className="section container">
      <span className="eyebrow">Checkout</span>
      <h1 className="title">Cart and order</h1>
      {ordered ? <p className="success glass">Order placed successfully. Track it from your account dashboard.</p> : null}
      {items.length === 0 ? (
        <div className="empty-state glass">
          <h2>Your cart is empty</h2>
          <p className="muted">Add gaming gear and come back to place an order.</p>
          <Link className="btn" href="/products">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-row glass" key={item.id}>
                <div className="cart-product">
                  <div className="cart-thumb">
                    <Image src={item.image} alt={item.name} fill sizes="96px" />
                  </div>
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">{formatCurrency(item.price)}</p>
                  </div>
                </div>
                <div className="qty">
                  <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                    <Plus size={16} />
                  </button>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
                <button className="icon-btn" onClick={() => dispatch(removeFromCart(item.id))} aria-label="Remove">
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
          <aside className="summary glass">
            <h2>Order summary</h2>
            <p className="muted">Payment gateway is intentionally skipped for presentation. Stripe can be added later.</p>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <button className="btn" onClick={placeOrder}>
              Place order
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
