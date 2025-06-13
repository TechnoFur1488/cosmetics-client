"use client"

import { useUpdateProductsMutation, useGetAllCatalogQuery, useGetAllSubCatalogQuery } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { Pencil } from "lucide-react"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface Props {
    productId: number
    isName: string
    isBrand: string
    isPrice: number
    isDiscount: number
    isCatalogId: number
    isSubCatalogId: number
    isImg: string
}

export const ProductsUpdate = ({ productId, isName, isBrand, isPrice, isDiscount, isCatalogId, isSubCatalogId, isImg }: Props) => {
    const [updateProduct] = useUpdateProductsMutation()
    const [existingImage, setExistingImage] = useState<string>(isImg)
    const [newImage, setNewImage] = useState<File | null>(null)
    const { data: catalogs } = useGetAllCatalogQuery()
    const [selectedCatalogId, setSelectedCatalogId] = useState<number>(isCatalogId)
    const { data: subCatalogs } = useGetAllSubCatalogQuery(selectedCatalogId)

    const formSchema = z.object({
        img: z.instanceof(File)
            .refine(file => file.size <= 5 * 1024 * 1024, "Файл должен быть меньше 5MB")
            .refine(
                file => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Только .jpg, .png или .webp форматы"
            ).optional(),
        name: z.string().min(2, { message: "Имя не может быть короче 2 символов" }),
        brand: z.string().min(2, { message: "Бренд не может быть короче 2 символов" }),
        price: z.number(),
        discount: z.number(),
        catalogId: z.number(),
        subCatalogId: z.number()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: isName,
            brand: isBrand,
            price: isPrice,
            discount: isDiscount,
            catalogId: isCatalogId,
            subCatalogId: isSubCatalogId
        }
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0])
            setExistingImage("")
        }
    }

    const removeImage = () => {
        setExistingImage("")
        setNewImage(null)
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            formData.append("id", String(productId))
            formData.append("existingImg", existingImage)
            if (newImage) {
                formData.append("img", newImage)
            }
            formData.append("name", data.name)
            formData.append("brand", data.brand)
            formData.append("price", String(data.price))
            formData.append("discount", String(data.discount))
            formData.append("catalogId", String(data.catalogId))
            formData.append("subCatalogId", String(data.subCatalogId))

            await updateProduct(formData).unwrap()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Pencil />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Обновить продукт</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-4">
                                <div className="space-y-2">
                                    <FormLabel>Изображение</FormLabel>
                                    {existingImage && (
                                        <div className="relative w-32 h-32">
                                            <Image
                                                src={process.env.NEXT_PUBLIC_APP_API_URL + existingImage}
                                                alt="Product"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                    />
                                </div>

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

                                <FormField
                                    control={form.control}
                                    name="catalogId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Каталог</FormLabel>
                                            <Select 
                                                onValueChange={(value) => {
                                                    const numValue = Number(value)
                                                    field.onChange(numValue)
                                                    setSelectedCatalogId(numValue)
                                                }} 
                                                defaultValue={String(field.value)}
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
                                                onValueChange={(value) => field.onChange(Number(value))} 
                                                defaultValue={String(field.value)}
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