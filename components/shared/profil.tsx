import Link from "next/link"
import { Input } from "../ui/input"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMyUserQuery, useUpdateUserMutation } from "@/store/apiSlice"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const Profil = () => {
    const { data: userData, isLoading } = useMyUserQuery()
    const [updateUser] = useUpdateUserMutation()
    const inputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")

    const formSchema = z.object({
        img: z.instanceof(File)
            .refine(file => file.size <= 5 * 1024 * 1024, "Файл должен быть меньше 5MB")
            .refine(
                file => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Только .jpg, .png или .webp форматы"
            ).optional(),
        name: z.string().min(2, { message: "Имя не может быть короче 2 символов" }),
        gender: z.enum(["Ж", "М"]),
        birthday: z.date(),
        phone: z.string().min(18, { message: "Введите корректный номер телефона" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            img: undefined,
            phone: "",
            name: "",
            gender: "Ж",
            birthday: new Date(),
        }
    })

    useEffect(() => {
        if (userData) {
            form.reset({
                phone: userData.phone || "",
                name: userData.name || "",
                gender: (userData.gender as "Ж" | "М") || "Ж",
                birthday: userData.birthday ? new Date(userData.birthday) : new Date(),
            })
            if (userData.img) {
                setPreviewUrl(process.env.NEXT_PUBLIC_APP_API_URL + userData.img)
            }
        }
    }, [userData, form])

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            if (data.img) {
                formData.append("img", data.img)
            }
            formData.append("name", data.name)
            formData.append("gender", data.gender)
            formData.append("birthday", data.birthday.toISOString())
            formData.append("phone", data.phone)

            await updateUser(formData)
        } catch (err) {
            console.error(err)
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('img', file)
            const imageUrl = URL.createObjectURL(file)
            setPreviewUrl(imageUrl)
        }
    }

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-10 px-4 sm:px-0">
            <div className="w-full max-w-[500px]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">Ваш личный профиль</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                <div className="flex flex-col items-center gap-4">
                                    <FormField
                                        control={form.control}
                                        name="img"
                                        render={() => (
                                            <FormItem>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            ref={inputRef}
                                                            className="hidden"
                                                            onChange={handleFileChange}
                                                            accept="image/jpeg, image/png, image/webp"
                                                        />
                                                    </FormControl>
                                                    <Avatar onClick={() => inputRef.current?.click()} className="w-[80px] h-[80px] sm:w-[111px] sm:h-[111px] cursor-pointer">
                                                        <AvatarImage src={previewUrl} />
                                                        <AvatarFallback>SC</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm sm:text-base">Имя</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Введите ваше имя" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm sm:text-base">Пол</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Ж" id="female" />
                                                        <label htmlFor="female" className="text-sm sm:text-base">Женский</label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="М" id="male" />
                                                        <label htmlFor="male" className="text-sm sm:text-base">Мужской</label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm sm:text-base">Дата рождения</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="date" 
                                                    {...field} 
                                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm sm:text-base">Телефон</FormLabel>
                                            <FormControl>
                                                <IMaskInput
                                                    className={cn(
                                                        "w-full px-3 py-2 rounded-md border border-gray-200",
                                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                                        "placeholder:text-gray-400 text-sm"
                                                    )}
                                                    mask="+7 (000) 000-00-00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full text-sm sm:text-base">
                                    Сохранить изменения
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto">
                <Link href="/cart" className="text-xl sm:text-3xl font-bold text-center sm:text-left hover:underline">
                    Корзина
                </Link>
                <Link href="/catalog/1" className="text-xl sm:text-3xl font-bold text-center sm:text-left hover:underline">
                    К покупкам
                </Link>
            </div>
        </div>
    )
}