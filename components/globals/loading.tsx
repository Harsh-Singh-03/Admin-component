import { Loader2 } from "lucide-react"

export const LoadingComponent = () => {
    return (
        <div className="flex items-center justify-center my-6">
            <Loader2 className="animate-spin text-muted-foreground h-12 w-12 " />
        </div>
    )
}