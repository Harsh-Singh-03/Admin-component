import { ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

interface props {
    children: ReactNode,
    trigger: ReactNode,
    title?: string,
    description?: string,
    className?: string,
}

export const CommonDialog = ({ trigger, children, description, title, className }: props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className={className || ""} >
                <DialogHeader>
                    {title && <DialogTitle> {title} </DialogTitle>}
                    {description && <DialogDescription> {description} </DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}