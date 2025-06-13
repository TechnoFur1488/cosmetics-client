import { useLoginMutation } from "@/store/apiSlice"
import { Button } from "../ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "../ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
    isSetRegister: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthLogin = ({ isSetRegister }: Props) => {
    const router = useRouter()
    const [login] = useLoginMutation()
    const [checkPassword, setCheckPassword] = useState(false)

    const formSchema = z.object({
        phone: z.string().min(18, { message: "Введите корректный номер телефона" }),
        password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await login({
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
                        <CardTitle>Вход в профиль</CardTitle>
                        <CardDescription className={"w-50"}>Введите свои данные от аккаунта что бы войти</CardDescription>
                        <CardAction onClick={() => isSetRegister(true)}>
                            <Button variant={"link"}>
                                Зарегистрироваться
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className={"space-y-5"}>
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
                        <Button className={"cursor-pointer"}>Войти</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}