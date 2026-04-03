"use client"
import { Button } from "~/components/ui/button"
import { Check, X, Trash } from "lucide-react"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function BookingActions({ id, status }: { id: string, status: string }) {
  const router = useRouter()

  const updateStatus = api.booking.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Booking updated")
      router.refresh()
    }
  })

  const deleteMutation = api.booking.delete.useMutation({
    onSuccess: () => {
      toast.success("Booking deleted")
      router.refresh()
    }
  })

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "PENDING" && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20"
            onClick={() => updateStatus.mutate({ id, status: "CONFIRMED" })}
            disabled={updateStatus.isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
            onClick={() => updateStatus.mutate({ id, status: "CANCELLED" })}
            disabled={updateStatus.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-xl bg-white/5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => {
          if (confirm("Delete this booking?")) {
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
