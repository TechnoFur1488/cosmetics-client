"use client"

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
import { usePostOrderMutation } from "@/store/apiSlice"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"


interface Props {
    refetch: () => void
}

export const CartOrder = ({ refetch }: Props) => {
    const [isSelfPickup, setIsSelfPickup] = useState(false)
    const [postOrder] = usePostOrderMutation()

    const formSchema = z.object({
        city: z.string().min(2, { message: "Название города не может быть короче 2 символов" }),
        delivery: z.enum(["Курьер", "Самовывоз"]),
        adress: z.string().optional(),
        phone: z.string().min(18, { message: "Введите корректный номер телефона" }),
        email: z.string().email({ message: "Введите корректную почту" }),
        name: z.string().min(2, { message: "Имя не может быть короче 2 символов" }),
        payment: z.enum(["СБП", "Наличными курьеру", "Картой"]),
        comment: z.string().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            city: "",
            delivery: "Курьер",
            adress: "",
            phone: "",
            email: "",
            name: "",
            payment: "СБП",
            comment: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await postOrder({
                newOrder: {
                    city: data.city,
                    delivery: data.delivery,
                    adress: data.adress || "",
                    comment: data.comment || "",
                    phone: data.phone,
                    email: data.email,
                    name: data.name,
                    payment: data.payment
                }
            }).unwrap()
            await refetch()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className={"bg-[#c1cab0] text-3xl font-bold py-3 px-10"}>
                Оформить заказ
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Оформление заказа</AlertDialogTitle>
                            <AlertDialogDescription className={"space-y-4"}>
                                <FormField
                                    control={form.control}
                                    name="delivery"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Доставка</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    className={"flex space-x-3"}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        setIsSelfPickup(value === "Самовывоз")
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <div className={"flex items-center space-x-1"}>
                                                        <RadioGroupItem id="Курьер" value="Курьер" />
                                                        <Label htmlFor="Курьер">Курьер</Label>
                                                    </div>
                                                    <div className={"flex items-center space-x-1"}>
                                                        <RadioGroupItem id="Самовывоз" value="Самовывоз" />
                                                        <Label htmlFor="Самовывоз">Самовывоз</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Название города</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!isSelfPickup && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="adress"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Адрес</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="comment"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Комментарий</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Почта</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Имя</FormLabel>
                                            <FormControl>
                                                <Input type="name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="payment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Способ оплаты</FormLabel>
                                            <FormControl>
                                                <RadioGroup className={"flex space-x-3"} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <div className={"flex items-center space-x-1"}>
                                                        <RadioGroupItem id="СБП" value="СБП" />
                                                        <Label htmlFor="СБП">СБП</Label>
                                                    </div>
                                                    {isSelfPickup &&
                                                        <div className={"flex items-center space-x-1"}>
                                                            <RadioGroupItem id="Наличными" value="Наличными курьеру" />
                                                            <Label htmlFor="Наличными">Наличными курьеру</Label>
                                                        </div>
                                                    }
                                                    <div className={"flex items-center space-x-1"}>
                                                        <RadioGroupItem id="Картой" value="Картой" />
                                                        <Label htmlFor="Картой">Картой</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Закрыть</AlertDialogCancel>
                                <AlertDialogAction type="submit">Оформить</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogHeader>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}