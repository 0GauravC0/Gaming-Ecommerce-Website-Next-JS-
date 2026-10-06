import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/commerce/ProductActions";
import { ReviewForm } from "@/components/commerce/ReviewForm";
import { formatCurrency } from "@/lib/format";
import { products, reviews } from "@/lib/products";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <main className="section container">
      <div className="detail-grid">
        <div className="detail-image glass">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 100vw, 50vw" />
        </div>
        <section className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1 className="title">{product.name}</h1>
          <p className="muted">{product.description}</p>
          <strong className="detail-price">{formatCurrency(product.price)}</strong>
          <p className="muted">Rating {product.rating}/5 from {product.reviews} customers. Stock: {product.stock}</p>
          <div className="tag-row">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <ProductActions product={product} />
        </section>
      </div>
      <section className="section">
        <h2>Reviews</h2>
        <div className="review-grid">
          {reviews
            .filter((review) => review.productId === product.id && review.status === "Approved")
            .map((review) => (
              <article className="glass review-card" key={review.id}>
                <strong>{review.customer}</strong>
                <span>{review.rating}/5</span>
                <p className="muted">{review.comment}</p>
              </article>
            ))}
          <ReviewForm productId={product.id} />
        </div>
      </section>
    </main>
  );
}
