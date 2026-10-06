"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { submitSupabaseReview } from "@/lib/supabaseData";
import { useAppSelector } from "@/store/hooks";

type ReviewValues = {
  rating: number;
  comment: string;
};

const schema = yup.object({
  rating: yup.number().min(1).max(5).required(),
  comment: yup.string().min(8, "Write at least 8 characters").required("Review is required")
});

export function ReviewForm({ productId }: { productId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReviewValues>({ resolver: yupResolver(schema), defaultValues: { rating: 5 } });

  const onSubmit = async (values: ReviewValues) => {
    await submitSupabaseReview(user?.id, productId, values.rating, values.comment);
    setSubmitted(true);
  };

  return (
    <form className="glass review-card" onSubmit={handleSubmit(onSubmit)}>
      <h3>Submit Your Review</h3>
      <input type="hidden" value={productId} />
      <label className="field">
        Rating
        <select {...register("rating")}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Review
        <textarea {...register("comment")} placeholder="Share your experience" />
        {errors.comment ? <span className="error">{errors.comment.message}</span> : null}
      </label>
      {submitted ? <p className="muted">Review sent for admin moderation.</p> : null}
      <button className="btn">
        <Send size={18} /> Submit
      </button>
    </form>
  );
}
