export type Category =
  | "Gaming Laptop"
  | "Gaming Monitors"
  | "Gaming Accessories"
  | "Gaming Mouse"
  | "Gaming Setups"
  | "PC Builds";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  badge: string;
  description: string;
  tags: string[];
  popularity: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type OrderStatus = "Pending" | "Shipped" | "Delivered";

export type Order = {
  id: string;
  user: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: number;
};

export type Review = {
  id: string;
  productId: string;
  customer: string;
  rating: number;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type Address = {
  id: string;
  label: string;
  line: string;
  city: string;
  phone: string;
};
