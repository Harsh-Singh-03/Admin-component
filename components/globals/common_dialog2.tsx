import { ReactNode } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"

interface props {
    children: ReactNode,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    title?: string,
    description?: string,
    className?: string,
}

export const CommonDialog2 = ({ children, description, title, className, open, setOpen }: props) => {
    return (
        <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
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