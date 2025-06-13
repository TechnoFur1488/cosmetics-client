"use client"

import { useUpdateCatalogMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Pencil } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Props {
    catalogId: number
    isName: string
}

export const CatalogNameUpdate = ({ catalogId, isName }: Props) => {
    const [updateCatalog] = useUpdateCatalogMutation()

    const formSchema = z.object({
        name: z.string().min(2, { message: "Название не может быть короче 2 символов" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: isName
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateCatalog({
                id: catalogId,
                catalogUpdate: {
                    name: data.name
                }
            }).unwrap()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className={"top-0 bottom-0"}>
                <Pencil />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Обновить название</AlertDialogTitle>
                            <AlertDialogDescription>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Название</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction type="submit">Обновить</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogHeader>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}