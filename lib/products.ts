import type { Address, Category, Order, Product, Review } from "@/types";

export const categories: Category[] = [
  "Gaming Laptop",
  "Gaming Monitors",
  "Gaming Accessories",
  "Gaming Mouse",
  "Gaming Setups",
  "PC Builds"
];

const imagePools: Record<Category, string[]> = {
  "Gaming Laptop": [
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80"
  ],
  "Gaming Monitors": [
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1200&q=80"
  ],
  "Gaming Accessories": [
    "https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80"
  ],
  "Gaming Mouse": [
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1629429408708-3a59f51979c5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1563297007-0686b7003af7?q=80&w=1517&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  "Gaming Setups": [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598550473359-9a39d9cf3914?auto=format&fit=crop&w=1200&q=80"
  ],
  "PC Builds": [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1632749042303-7f7a18ed6ff0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1644253056970-c32f96ffdaf8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    'https://images.unsplash.com/photo-1718777025831-5cb28feb8518?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    "https://images.unsplash.com/photo-1751374156944-aa91dee48408?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]
};

const templates: Record<Category, { names: string[]; basePrice: number; tags: string[]; description: string }> = {
  "Gaming Laptop": {
    names: ["NovaBlade", "ROG Titan", "AeroStrike", "Predator Flux", "Legion Core", "PulseBook"],
    basePrice: 89999,
    tags: ["RTX", "165Hz", "RGB"],
    description: "Portable high-refresh gaming machine with tuned thermals, fast storage, and vivid display output."
  },
  "Gaming Monitors": {
    names: ["StormCurve", "PixelRush", "ArenaView", "SpectraQ", "UltraSync", "NightFrame"],
    basePrice: 18999,
    tags: ["QHD", "HDR", "Adaptive Sync"],
    description: "Sharp gaming display built for smooth motion, low input lag, and immersive color."
  },
  "Gaming Accessories": {
    names: ["Command Kit", "Pulse Deck", "Echo Stand", "Forge Keys", "Arena Dock", "Signal Pack"],
    basePrice: 2999,
    tags: ["RGB", "USB-C", "Desk Ready"],
    description: "Useful setup gear for cleaner cable management, comfort, lighting, and everyday play."
  },
  "Gaming Mouse": {
    names: ["Phantom X", "ViperCore", "Glide Pro", "ZeroLag", "Apex Clutch", "ShadowAim"],
    basePrice: 1999,
    tags: ["Wireless", "26K DPI", "Lightweight"],
    description: "Precision gaming mouse with responsive switches, accurate tracking, and comfortable grip."
  },
  "Gaming Setups": {
    names: ["Arena RGB", "Streamer Bay", "Command Room", "Duo Station", "Creator Grid", "Night Desk"],
    basePrice: 24999,
    tags: ["Bundle", "Lighting", "Ergonomic"],
    description: "Complete setup bundle combining desk essentials, lighting, comfort, and matching accessories."
  },
  "PC Builds": {
    names: ["ForgeCore", "Hydra Tower", "Vector X", "Obsidian Rig", "Titan Loop", "Creator Max"],
    basePrice: 74999,
    tags: ["Custom", "Liquid Cooling", "RTX"],
    description: "Custom desktop build with balanced airflow, gaming-grade graphics, and upgrade-ready parts."
  }
};

const badges = ["Featured", "Trending", "Top Deal", "New", "Premium", "Hot"];

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildProducts(): Product[] {
  return categories.flatMap((category) => {
    const template = templates[category];
    return Array.from({ length: 24 }, (_, index) => {
      const model = template.names[index % template.names.length];
      const tier = ["S", "Pro", "Elite", "Max"][index % 4];
      const version = 15 + index;
      const price = template.basePrice + index * Math.round(template.basePrice * 0.08) + (index % 3) * 2500;
      const rating = Number((4.2 + (index % 8) * 0.09).toFixed(1));
      const productName = `${model} ${tier} ${version}`;

      return {
        id: `${slug(category)}-${slug(model)}-${index + 1}`,
        name: productName,
        category,
        price,
        rating,
        reviews: 32 + index * 9,
        stock: 3 + ((index * 7) % 46),
        image: imagePools[category][index % imagePools[category].length],
        badge: badges[index % badges.length],
        description: template.description,
        tags: template.tags,
        popularity: 100 - (index % 24)
      };
    });
  });
}

export const products: Product[] = buildProducts();

export const orders: Order[] = [
  { id: "ORD-1048", user: "Aarav Mehta", total: 197498, status: "Pending", date: "2026-05-21", items: 2 },
  { id: "ORD-1047", user: "Priya Nair", total: 89999, status: "Shipped", date: "2026-05-19", items: 1 },
  { id: "ORD-1046", user: "Rohan Das", total: 42999, status: "Delivered", date: "2026-05-18", items: 1 }
];

export const reviews: Review[] = [
  {
    id: "REV-801",
    productId: products[0].id,
    customer: "Kabir",
    rating: 5,
    comment: "Fast, quiet, and the display is perfect for competitive titles.",
    status: "Approved"
  },
  {
    id: "REV-802",
    productId: products.find((product) => product.category === "Gaming Mouse")?.id ?? products[0].id,
    customer: "Mira",
    rating: 4,
    comment: "Great shape and battery. Needs one more side button.",
    status: "Pending"
  }
];

export const addresses: Address[] = [
  {
    id: "ADDR-1",
    label: "Home",
    line: "221B Esports Avenue",
    city: "Kolkata",
    phone: "+91 90000 00000"
  }
];
