"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Checkbox } from "~/components/ui/checkbox"
import { api } from "~/trpc/react"

const productSchema = z.object({
  nameEn: z.string().min(1, "Name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.string().min(1, "Price is required"),
  quantity: z.coerce.number().min(0),
  isNewProd: z.boolean(),
})

type ProductFormValues = z.infer<typeof productSchema>

export function ProductForm({ initialData }: { initialData?: {
  id?: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  price: string;
  quantity: number;
  isNewProd: boolean | null;
} }) {
  const router = useRouter()
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameEn: initialData?.nameEn ?? "",
      nameAr: initialData?.nameAr ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      descriptionAr: initialData?.descriptionAr ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      price: initialData?.price ?? "5 JOD",
      quantity: Number(initialData?.quantity) ?? 0,
      isNewProd: initialData?.isNewProd === true,
    },
  })

  // Mutations with explicit typing to avoid inference issues
  const createMutation = api.product.create.useMutation({
    onSuccess: () => {
      router.push("/admin/products")
      router.refresh()
    }
  })

  const updateMutation = api.product.update.useMutation({
    onSuccess: () => {
      router.push("/admin/products")
      router.refresh()
    }
  })

  const onSubmit = (values: ProductFormValues) => {
    const payload = {
      ...values,
      quantity: Number(values.quantity),
    }

    if (initialData?.id) {
      updateMutation.mutate({ 
        id: initialData.id, 
        ...payload
      })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 glass dark:glass-dark p-8 rounded-3xl border border-white/10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white/90">English Details</h3>
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70">Product Name (EN)</FormLabel>
                  <FormControl>
                    <Input placeholder="Premium Wax" {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70">Description (EN)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details about product..." {...field} className="glass-input min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white/90">Arabic Details</h3>
            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70">Product Name (AR)</FormLabel>
                  <FormControl>
                    <Input placeholder="واكس فاخر" {...field} className="glass-input text-right" dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70">Description (AR)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="تفاصيل المنتج..." {...field} className="glass-input text-right min-h-[120px]" dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-4 border-t border-white/5">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70">Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70">Price</FormLabel>
                <FormControl>
                  <Input placeholder="5 JOD" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70">Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isNewProd"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-white/10 p-6 glass-card bg-white/5">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-white/30 data-[state=checked]:bg-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white/90">Mark as New</FormLabel>
                <FormDescription className="text-white/40">
                  Show this product in the &apos;Latest Products&apos; carousel on the landing page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push("/admin/products")}
            className="rounded-full px-8 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded-full px-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
          >
            {createMutation.isPending || updateMutation.isPending ? "Saving..." : (initialData ? "Update Product" : "Create Product")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
