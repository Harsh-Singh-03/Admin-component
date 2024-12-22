"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authentication } from "@/lib/api"
import { toast } from "sonner"
import { useRef } from "react"
import { Loader2 } from "lucide-react"
import { KEYS } from "@/lib/query-key"

interface props {
    isEdit: boolean,
    initialData?: {
        _id: string;
        title: string,
        description: string
    }
}

const formSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be at least 3 characters'
    }),
    description: z.string().optional()
})


export const PermissionFrom = ({ isEdit, initialData }: props) => {
    const closeRef = useRef<HTMLButtonElement | null>(null)
    const queryClient = useQueryClient();

    const onSuccess = (data: any) => {
        toast.success(data.message)
        form.reset()
        queryClient.invalidateQueries({ queryKey: [KEYS.PERMISSION_KEY]});
        closeRef?.current?.click()
    }

    const { isPending, mutate: createPermission } = useMutation({
        mutationFn: authentication.create_permission,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const { isPending: isUpdating, mutate: updatePermission } = useMutation({
        mutationFn: authentication.update_permission,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
        },
    })

    const onSubmit = (val: z.infer<typeof formSchema>) => isEdit ? updatePermission({id: initialData?._id || '', data: val}) : createPermission(val);

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="p-4 pt-0 space-y-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title :</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter title.." {...field} disabled={isPending || isUpdating} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description :</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter description.." {...field} rows={3} disabled={isPending || isUpdating} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter className="gap-1">
                    <DialogClose asChild>
                        <Button variant="btn2" ref={closeRef}>Close</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending || isUpdating} >
                        {(isPending || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}