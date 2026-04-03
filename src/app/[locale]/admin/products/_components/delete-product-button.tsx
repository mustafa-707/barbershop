"use client"
import { Button } from "~/components/ui/button"
import { Trash } from "lucide-react"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const deleteMutation = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully")
      router.refresh()
    },
    onError: (error) => {
      toast.error(`Error deleting product: ${error.message}`)
    }
  })

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate({ id })
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-11 w-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      <Trash className="h-5 w-5" />
    </Button>
  )
}
