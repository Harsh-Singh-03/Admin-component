"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/app-hooks"

const formSchema = z.object({
    email: z.string().email({
        message: 'Please eneter an valid email address'
    }),
    password: z.string().min(8, {
        message: 'password must be at least 8 characters'
    }),
})

export function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const {mutate: login, isPending} = useLogin()
   
    const onSubmit = (data: z.infer<typeof formSchema>) => login(data);

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email :</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password :</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your email" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} >Submit</Button>
            </form>
        </Form>
    )
}
