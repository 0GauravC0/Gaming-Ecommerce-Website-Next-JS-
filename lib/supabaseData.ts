import { categories, products as fallbackProducts, orders as fallbackOrders, reviews as fallbackReviews } from "@/lib/products";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type { Category, Order, OrderStatus, Product, Review } from "@/types";

type DbProduct = {
  id: string;
  name: string;
  price: number;
  rating: number;
  stock: number;
  image_url: string | null;
  description: string | null;
  tags: string[] | null;
  is_featured: boolean;
  categories: { name: Category } | null;
};

const fallbackImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80";

function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.categories?.name ?? "Gaming Accessories",
    price: Number(product.price),
    rating: Number(product.rating ?? 0),
    reviews: 0,
    stock: product.stock,
    image: product.image_url ?? fallbackImage,
    badge: product.is_featured ? "Featured" : "New",
    description: product.description ?? "Gaming product ready for your setup.",
    tags: product.tags ?? [],
    popularity: product.is_featured ? 95 : 70
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig || !supabase) return fallbackProducts;
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,rating,stock,image_url,description,tags,is_featured,categories(name)")
    .order("created_at", { ascending: false });
  if (error || !data?.length) return fallbackProducts;
  return (data as unknown as DbProduct[]).map(mapProduct);
}

export async function createProduct(input: Pick<Product, "name" | "price" | "stock" | "description" | "image">) {
  if (!hasSupabaseConfig || !supabase) return null;
  const { data: category } = await supabase.from("categories").select("id").eq("name", categories[2]).single();
  return supabase.from("products").insert({
    name: input.name,
    price: input.price,
    stock: input.stock,
    description: input.description,
    category_id: category?.id,
    image_url: input.image || fallbackImage,
    tags: ["New"]
  });
}

export async function updateProductStock(id: string, stock: number) {
  if (!hasSupabaseConfig || !supabase) return null;
  return supabase.from("products").update({ stock }).eq("id", id);
}

export async function deleteProductById(id: string) {
  if (!hasSupabaseConfig || !supabase) return null;
  return supabase.from("products").delete().eq("id", id);
}

export async function getOrders(): Promise<Order[]> {
  if (!hasSupabaseConfig || !supabase) return fallbackOrders;
  const { data, error } = await supabase.from("orders").select("id,total,status,created_at,profiles(email)");
  if (error || !data?.length) return fallbackOrders;
  return data.map((order: any) => ({
    id: order.id.slice(0, 8).toUpperCase(),
    user: order.profiles?.email ?? "Customer",
    total: Number(order.total),
    status: order.status as OrderStatus,
    date: String(order.created_at).slice(0, 10),
    items: 1
  }));
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!hasSupabaseConfig || !supabase || id.startsWith("ORD-")) return null;
  return supabase.from("orders").update({ status }).eq("id", id);
}

export async function getReviews(): Promise<Review[]> {
  if (!hasSupabaseConfig || !supabase) return fallbackReviews;
  const { data, error } = await supabase.from("reviews").select("id,product_id,rating,comment,status,profiles(email)");
  if (error || !data?.length) return fallbackReviews;
  return data.map((review: any) => ({
    id: review.id,
    productId: review.product_id,
    customer: review.profiles?.email ?? "Customer",
    rating: review.rating,
    comment: review.comment,
    status: review.status
  }));
}

export async function moderateReview(id: string, status: Review["status"]) {
  if (!hasSupabaseConfig || !supabase || id.startsWith("REV-")) return null;
  return supabase.from("reviews").update({ status }).eq("id", id);
}

export async function placeSupabaseOrder(userId: string | undefined, items: Array<{ id: string; price: number; quantity: number }>) {
  if (!hasSupabaseConfig || !supabase || !userId || items.length === 0) return null;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { data: order, error } = await supabase
    .from("orders")
    .insert({ user_id: userId, total, status: "Pending" })
    .select("id")
    .single();

  if (error || !order) return { error };

  return supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))
  );
}

export async function submitSupabaseReview(userId: string | undefined, productId: string, rating: number, comment: string) {
  if (!hasSupabaseConfig || !supabase || !userId) return null;
  return supabase.from("reviews").insert({
    user_id: userId,
    product_id: productId,
    rating,
    comment,
    status: "Pending"
  });
}
