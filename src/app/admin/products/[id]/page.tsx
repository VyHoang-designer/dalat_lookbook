import { getProductById } from "@/lib/db/products";
import { getCategories } from "@/lib/db/categories";
import EditProductForm from "./edit-form";
import { notFound } from "next/navigation";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} categories={categories} />;
}
