import { useRegistrationMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { Input } from "../ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
    isSetRegister: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthRegistration = ({ isSetRegister }: Props) => {
    const router = useRouter()
    const [registration] = useRegistrationMutation()
    const [checkPassword, setCheckPassword] = useState(false)

    const formSchema = z.object({
        name: z.string().min(2, { message: "Имя не может быть короче 2 символов" }),
        phone: z.string().min(18, { message: "Введите корректный номер телефона" }),
        password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await registration({
                name: data.name,
                phone: data.phone,
                password: data.password
            }).unwrap()
            localStorage.setItem("token", response.token)
            router.push("/profil")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className={"w-150"}>
                    <CardHeader>
                        <CardTitle>Регистрация нового профиля</CardTitle>
                        <CardDescription className={"w-50"}>Введите данные для регистрации</CardDescription>
                        <CardAction onClick={() => isSetRegister(false)}>
                            <Button variant={"link"}>
                                Войти
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className={"space-y-5"}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
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
                                    <FormLabel>Номер телефона</FormLabel>
                                    <FormControl>
                                        <IMaskInput
                                            className={cn(
                                                "w-full px-3 py-2 rounded-md border border-gray-200",
                                                "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                                "placeholder:text-gray-400 text-sm"
                                            )}
                                            mask={"+7 (000) 000-00-00"}
                                            {...field}
                                        />
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
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <div className={"relative"}>
                                            <Input type={checkPassword ? "text" : "password"} {...field} />
                                            <button className={"absolute right-0 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"} type="button" onClick={() => setCheckPassword(!checkPassword)}>{checkPassword ? <Eye /> : <EyeOff />}</button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button className={"cursor-pointer"}>Зарегистрироваться</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
