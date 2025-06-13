"use client"

import { useCreateCatalogMutation, useCreateSubCatalogMutation, useGetAllCatalogQuery } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"

export const CatalogCreate = () => {
    const [createCatalog] = useCreateCatalogMutation()
    const [createSubCatalog] = useCreateSubCatalogMutation()
    const { data: catalogs } = useGetAllCatalogQuery()
    const [isSubCatalog, setIsSubCatalog] = useState(false)

    const formSchema = z.object({
        name: z.string().min(2, { message: "Название не может быть короче 2 символов" }),
        catalogId: z.number().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            catalogId: undefined
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (!isSubCatalog) {
                await createCatalog({
                    newCatalog: {
                        name: data.name
                    }
                }).unwrap()
            } else {
                if (data.catalogId) {
                    await createSubCatalog({
                        newSubCatalog: {
                            name: data.name,
                            catalogId: data.catalogId
                        }
                    }).unwrap()
                }
            }
            form.reset()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Создать каталог</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormItem>
                            <FormLabel>Тип</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"
                                    onValueChange={(value) => {
                                        setIsSubCatalog(value === "subcatalog")
                                        form.reset()
                                    }}
                                    defaultValue={isSubCatalog ? "subcatalog" : "catalog"}
                                >
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem id="catalog" value="catalog" />
                                        <Label htmlFor="catalog">Каталог</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem id="subcatalog" value="subcatalog" />
                                        <Label htmlFor="subcatalog">Подкаталог</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>

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

                        {isSubCatalog && (
                            <FormField
                                control={form.control}
                                name="catalogId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Каталог</FormLabel>
                                        <Select
                                            value={field.value?.toString()}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите каталог" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {catalogs?.catalog.map((catalog) => (
                                                    <SelectItem key={catalog.id} value={String(catalog.id)}>
                                                        {catalog.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button type="submit" className="w-full">
                            Создать {isSubCatalog ? "подкаталог" : "каталог"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}