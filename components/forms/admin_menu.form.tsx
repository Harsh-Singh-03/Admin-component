"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { general_action } from "@/lib/api"
import { toast } from "sonner"
import { useRef } from "react"
import { icons, Loader2 } from "lucide-react"
import { KEYS } from "@/lib/query-key"
import { useFetchSideMenu, usePermissions } from "@/hooks/app-hooks"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { ScrollArea } from "../ui/scroll-area"
import { Combobox } from "../ui/multiple-selector"

const isValidLucideIcon = (iconName: string) => {
    return iconName in icons;
};

const formSchema = z
    .object({
        title: z.string().min(3, {
            message: 'Title must be at least 3 characters',
        }),
        url: z.string().optional(),
        type: z.enum(['Link', 'Sub'], {
            message: 'Type must be either "Link" or "Sub"',
        }),
        parentId: z.string().optional(),
        icon: z
            .string()
            .optional()
            .refine((icon) => !icon || isValidLucideIcon(icon), {
                message: 'Icon must be a valid Lucide icon name.',
            }),
        permissions: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.type === 'Link') {
                return data.url && data.url.trim().length > 0;
            }
            return true;
        },
        {
            message: 'URL is required when type is "Link".',
            path: ['url'],
        }
    );

export const AdminMenuFrom = ({ isEdit, initialData }: { isEdit: boolean, initialData: any }) => {
    const closeRef = useRef<HTMLButtonElement | null>(null)
    const queryClient = useQueryClient();

    const { data: Menus }: any = useFetchSideMenu()
    const { data: Permissions }: any = usePermissions({})

    const onSuccess = (data: any) => {
        toast.success(data.message)
        form.reset()
        queryClient.invalidateQueries({ queryKey: [KEYS.ADMIN_MENU] });
        closeRef?.current?.click()
    }

    const { isPending, mutate: createMenu } = useMutation({
        mutationFn: general_action.create_menu,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const { isPending: isUpdating, mutate: updateMenu } = useMutation({
        mutationFn: general_action.update_menu,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            url: initialData?.url || "",
            type: initialData?.type || "Link",
            icon: initialData?.icon || "",
            permissions: initialData?.permission_id || '',
            parentId: initialData?.parentId || '',
        },
    })

    const onSubmit = (val: z.infer<typeof formSchema>) => isEdit ? updateMenu({ id: initialData?._id, data: val }) : createMenu(val);

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
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Url :</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Enter pathname.." {...field} disabled={isPending || isUpdating} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type :</FormLabel>
                                    <FormControl>
                                        <RadioGroup {...field} onValueChange={(value) => field.onChange(value)} className="flex gap-4 items-center" disabled={isPending || isUpdating} >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Link" id="r1" />
                                                <Label htmlFor="r1">Direct Link</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Sub" id="r2" />
                                                <Label htmlFor="r2">Sub Menu</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                                    {Menus?.data?.map((menu: any, i: number) =>
                                                        !menu.parentId && menu.type === 'Sub' && (
                                                            <SelectItem key={i} value={menu._id}>{menu.title}</SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="permissions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permission :</FormLabel>
                                    <FormControl>
                                        <Select {...field} onValueChange={(val) => field.onChange(val)} disabled={isPending || isUpdating}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select permission" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select Permission</SelectLabel>
                                                    {Permissions?.data?.map((p: any, i: number) => (
                                                        <SelectItem key={i} value={p._id}>{p.title}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon :</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Enter icon name (lucide icon).." {...field} disabled={isPending || isUpdating} />
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