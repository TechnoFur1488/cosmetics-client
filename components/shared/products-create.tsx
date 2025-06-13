"use client"

import { useCreateProducetMutation, useGetAllCatalogQuery, useGetAllSubCatalogQuery } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"
import Image from "next/image"

export const ProductsCreate = () => {
    const [postProduct] = useCreateProducetMutation()
    const [selectedCatalogId, setSelectedCatalogId] = useState<number>(0)
    const { data: catalogs } = useGetAllCatalogQuery()
    const { data: subCatalogs } = useGetAllSubCatalogQuery(selectedCatalogId)
    const [previewUrl, setPreviewUrl] = useState<string>("")

    const formSchema = z.object({
        img: z.instanceof(File)
            .refine(file => file.size <= 5 * 1024 * 1024, "Файл должен быть меньше 5MB")
            .refine(
                file => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Только .jpg, .png или .webp форматы"
            ),
        name: z.string().min(2, { message: "Имя не может быть короче 2 символов" }),
        brand: z.string().min(2, { message: "Бренд не может быть короче 2 символов" }),
        price: z.coerce.number(),
        discount: z.coerce.number(),
        catalogId: z.coerce.number(),
        subCatalogId: z.coerce.number()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            price: 0,
            discount: 0,
            catalogId: 0,
            subCatalogId: 0
        }
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            field.onChange(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()
            formData.append("img", data.img)
            formData.append("name", data.name)
            formData.append("brand", data.brand)
            formData.append("price", String(data.price))
            formData.append("discount", String(data.discount))
            formData.append("catalogId", String(data.catalogId))
            formData.append("subCatalogId", String(data.subCatalogId))

            await postProduct(formData).unwrap()
            form.reset()
            setPreviewUrl("")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Создать новый продукт</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="img"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Изображение</FormLabel>
                                    {previewUrl && (
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                                            <Image 
                                                src={previewUrl} 
                                                alt="Preview" 
                                                fill
                                                className="object-cover rounded-md"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleImageChange(e, { onChange })}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Бренд</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Цена</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Скидка</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="catalogId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Каталог</FormLabel>
                                        <Select 
                                            value={String(field.value)}
                                            onValueChange={(value) => {
                                                const numValue = Number(value)
                                                field.onChange(numValue)
                                                setSelectedCatalogId(numValue)
                                            }}
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

                            <FormField
                                control={form.control}
                                name="subCatalogId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Подкаталог</FormLabel>
                                        <Select 
                                            value={String(field.value)}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите подкаталог" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subCatalogs?.catalog.map((subCatalog) => (
                                                    <SelectItem key={subCatalog.id} value={String(subCatalog.id)}>
                                                        {subCatalog.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">Создать продукт</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}