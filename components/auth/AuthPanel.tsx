"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { adminEmail, hasSupabaseConfig, supabase } from "@/lib/supabase";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";

type AuthValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Use at least 6 characters").required("Password is required")
});

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: AuthValues) => {
    setMessage("");
    let authId: string | undefined;
    let profileRole: "admin" | "customer" | null = null;

    if (hasSupabaseConfig && supabase) {
      const response =
        mode === "register"
          ? await supabase.auth.signUp({ email: values.email, password: values.password })
          : await supabase.auth.signInWithPassword({ email: values.email, password: values.password });

      if (response.error) {
        setMessage(response.error.message);
        return;
      }
      authId = response.data.user?.id;

      if (authId) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", authId).single();
        profileRole = profile?.role ?? null;
      }
    }

    const role = profileRole ?? (values.email.toLowerCase() === adminEmail.toLowerCase() ? "admin" : "customer");
    const user = { id: authId, email: values.email, role } as const;
    window.localStorage.setItem("gameforge_user", JSON.stringify(user));
    dispatch(setUser(user));
    router.push(role === "admin" ? "/admin" : "/");
  };

  return (
    <section className="auth-wrap container">
      <div className="auth-card glass">
        <div>
          <span className="eyebrow">Secure access</span>
          <h1 className="">Login or create your SteelTech account</h1>

          <div className="admin-note">
            <strong>{adminEmail}</strong>
            <strong>: GHyu25@$</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="tabs">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
              Register
            </button>
          </div>
          <label className="field">
            Email
            <input placeholder="you@example.com" {...register("email")} />
            {errors.email ? <span className="error">{errors.email.message}</span> : null}
          </label>
          <label className="field">
            Password
            <input type="password" placeholder="minimum 6 characters" {...register("password")} />
            {errors.password ? <span className="error">{errors.password.message}</span> : null}
          </label>
          {message ? <p className="error">{message}</p> : null}
          
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}
