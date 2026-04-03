import { db } from "~/server/db";
import { ProductForm } from "../_components/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, id),
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Modify product details and stock.</p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
