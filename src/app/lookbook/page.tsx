import { getProducts } from "@/lib/db/products";
import LookbookClientPage from "./client-page";

export default async function LookbookPage() {
  const products = await getProducts();
  return <LookbookClientPage products={products} />;
}
