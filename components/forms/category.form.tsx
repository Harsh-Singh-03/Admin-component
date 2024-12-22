"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { ScrollArea } from "../ui/scroll-area"
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { FileUploader } from "../globals/file-uploader";
import { toast } from "sonner";
import { KEYS } from "@/lib/query-key";
import { catalog_api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCategories } from "@/hooks/app-hooks";

const formSchema = z
    .object({
        title: z.string().min(3, {
            message: 'Title must be at least 3 characters',
        }),
        description: z.string().optional(),
        logo: z.string().optional(),
        banner: z.string().optional(),
        parentId: z.string().optional(),
        status: z.string().optional(),
    })

interface props {
    isEdit: boolean,
    initialData?: {
        _id: string;
        title: string;
        description: string;
        logo: string;
        banner: string;
        parentId: string;
        total_sub_menu: number;
        status?: string;
    }
}

export const CategoryForm = ({ isEdit, initialData }: props) => {
    const closeRef = useRef<HTMLButtonElement | null>(null)
    const queryClient = useQueryClient()
    const { requiredPermissions } = useAuth()

    const { data: allCategory }: any = useCategories.getAll({ data: { parentId: '' }, permission: requiredPermissions })

    const onSuccess = (data: any) => {
        toast.success(data.message)
        form.reset()
        queryClient.invalidateQueries({ queryKey: [KEYS.CATEGORY_LIST] });
        closeRef?.current?.click()
    }

    const { isPending, mutate: createCategory } = useMutation({
        mutationFn: catalog_api.create_category,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const { isPending: isUpdating, mutate: updateCategory } = useMutation({
        mutationFn: catalog_api.update_category,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            logo: initialData?.logo || "",
            banner: initialData?.banner || "",
            parentId: initialData?.parentId || '',
            status: initialData?.status || 'Active',
        },
    })

    const onSubmit = (val: z.infer<typeof formSchema>) => isEdit ? updateCategory({ id: initialData?._id, data: val, permission: requiredPermissions }) : createCategory({ data: val, permission: requiredPermissions });

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <ScrollArea className="h-[50vh]">
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
                                        <Textarea rows={3} placeholder="Enter description.." {...field} disabled={isPending || isUpdating} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {(!isEdit || initialData?.total_sub_menu === 0) && (
                            <FormField
                                control={form.control}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Menu :</FormLabel>
                                        <FormControl>
                                            <Select {...field} onValueChange={(val) => field.onChange(val)} disabled={isPending || isUpdating}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a parent menu" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select Parent Menu</SelectLabel>
                                                        {allCategory?.data?.map((item: any, index: number) => (
                                                            <SelectItem key={index} value={item._id}>{item.title}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {isEdit && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status :</FormLabel>
                                        <FormControl>
                                            <Select {...field} onValueChange={(val) => field.onChange(val)} disabled={isPending || isUpdating}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="update status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Update status</SelectLabel>
                                                        <SelectItem value="Active">Active</SelectItem>
                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Controller
                            name="logo"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo :</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            onSingleChange={field.onChange}
                                            multiple={false}
                                            max={1}
                                            initialValue={field.value}
                                            disabled={isPending || isUpdating}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Controller
                            name="banner"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banner :</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            onSingleChange={field.onChange}
                                            multiple={false}
                                            max={1}
                                            disabled={isPending || isUpdating}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </ScrollArea>
                <DialogFooter className="gap-1">
                    <DialogClose asChild>
                        <Button variant="btn2" ref={closeRef}>Close</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending || isUpdating} >
                        {(isPending || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
