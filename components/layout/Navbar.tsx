"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, ShoppingCart, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export function Navbar() {
  const cartCount = useAppSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const wishCount = useAppSelector((state) => state.wishlist.items.length);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem("gameforge_user");
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="nav-shell">
      <div className="container nav">
        <Link className="brand" href="/">
          SteelTech
        </Link>
        <nav>
          <Link href="/products">Products</Link>
          {user? (
            <>
            <Link href="/wishlist">
            <Heart size={18} /> {wishCount}
          </Link>
          <Link href="/cart">
            <ShoppingCart size={18} /> {cartCount}
          </Link>
          <Link href="/account">
            <User size={18} /> Account
          </Link>
            </>
          ):null}
          {user?.role === "admin" ? (
            <Link className="admin-link" href="/admin">
              <LayoutDashboard size={18} /> Admin
            </Link>
          ) : null}
          {user ? (
            <button className="nav-button" onClick={handleLogout} aria-label="Logout">
              <LogOut size={18} />
            </button>
          ) : (
            <Link className="login-link" href="/auth">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
