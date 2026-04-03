"use client"
import { Button } from "~/components/ui/button"
import { PackageCheck, Truck, Trash } from "lucide-react"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function OrderActions({ id, status }: { id: string, status: string }) {
  const router = useRouter()

  const updateStatus = api.order.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Order updated")
      router.refresh()
    }
  })

  const deleteMutation = api.order.delete.useMutation({
    onSuccess: () => {
      toast.success("Order deleted")
      router.refresh()
    }
  })

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "PENDING" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
          onClick={() => updateStatus.mutate({ id, status: "PROCESSING" })}
          disabled={updateStatus.isPending}
          title="Mark as Processing"
        >
          <PackageCheck className="h-4 w-4" />
        </Button>
      )}
      {status === "PROCESSING" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20"
          onClick={() => updateStatus.mutate({ id, status: "READY" })}
          disabled={updateStatus.isPending}
          title="Mark as Ready"
        >
          <Truck className="h-4 w-4" />
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-xl bg-white/5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => {
          if (confirm("Delete this order?")) {
            deleteMutation.mutate({ id })
          }
        }}
        disabled={deleteMutation.isPending}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}
