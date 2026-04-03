import { ProductForm } from "../_components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Product</h1>
        <p className="text-muted-foreground">Add a new item to the store catalog.</p>
      </div>
      <ProductForm />
    </div>
  );
}
