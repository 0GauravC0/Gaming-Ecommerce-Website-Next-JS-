"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { setUser } from "@/store/authSlice";
import { setCartItems } from "@/store/cartSlice";
import { setWishlistItems } from "@/store/wishlistSlice";
import { GsapAnimations } from "@/components/layout/GsapAnimations";
import { ToastProvider } from "@/components/layout/ToastProvider";

function AuthHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = window.localStorage.getItem("gameforge_user");
    if (stored) {
      store.dispatch(setUser(JSON.parse(stored)));
    }

    const cart = window.localStorage.getItem("gameforge_cart");
    if (cart) {
      store.dispatch(setCartItems(JSON.parse(cart)));
    }

    const wishlist = window.localStorage.getItem("gameforge_wishlist");
    if (wishlist) {
      store.dispatch(setWishlistItems(JSON.parse(wishlist)));
    }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      window.localStorage.setItem("gameforge_cart", JSON.stringify(state.cart.items));
      window.localStorage.setItem("gameforge_wishlist", JSON.stringify(state.wishlist.items));
    });

    return unsubscribe;
  }, []);

  return children;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GsapAnimations />
      <AuthHydrator>{children}</AuthHydrator>
      <ToastProvider />
    </Provider>
  );
}
