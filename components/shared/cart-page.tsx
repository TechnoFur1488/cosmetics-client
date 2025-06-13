"use client"

import { useDeleteCartMutation, useGetCartQuery } from "@/store/apiSlice"
import Image from "next/image"
import { CartUpdate } from "./cart-update"
import { CartOrder } from "./cart-order"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { Trash } from "lucide-react"

export const CartPage = () => {
    const role = useTokenDecryptor()

    const { data, isLoading, isError, refetch } = useGetCartQuery()
    const [deleteCartItem] = useDeleteCartMutation()

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    const total = data.cartItem.map(el => el.total)
    const totalSum = total.reduce((sum, num) => sum + num, 0)

    const handleClickDeleteCartItem = async (id: number) => {
        try {
            await deleteCartItem(id).unwrap()
        } catch (err) {
            console.error
        }
    }

    return (
        <div className="px-4 sm:px-0">
            <div className="my-6 sm:my-10">
                <div className="space-y-6 sm:space-y-10">
                    {data.cartItem.map(el => (
                        <div key={el.id} className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-10 h-auto sm:h-81 relative">
                            <div className="w-full sm:w-100 bg-[#D9D9D9] flex items-center justify-center">
                                <div className="relative h-48 sm:h-81 w-full sm:w-[90%]">
                                    <Image className="object-cover" src={process.env.NEXT_PUBLIC_APP_API_URL + el.img} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                </div>
                            </div>
                            <div className="flex flex-col text-2xl sm:text-3xl font-bold max-w-[233px] space-y-4">
                                <span>
                                    {el.brand}
                                </span>
                                <span>
                                    {el.name}
                                </span>
                                <CartUpdate quantity={el.quantity} id={el.id} productId={el.productId} />
                            </div>
                            <div className="flex h-full items-end sm:ml-10">
                                <span className="text-2xl sm:text-3xl font-bold">{el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            </div>
                            {role &&
                                <button onClick={() => handleClickDeleteCartItem(el.id)} className="absolute top-0 right-0 sm:left-2 sm:top-0"><Trash /></button>
                            }
                        </div>
                    ))}
                </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold pt-6 sm:pt-9.5">Сумма заказа</span>
            <div className="flex flex-col sm:flex-row items-center w-full sm:w-200 space-y-4 sm:space-y-0 sm:space-x-5 my-6 sm:my-10">
                <span className="w-full sm:w-100 text-xl sm:text-2xl font-bold text-center sm:text-left">Стоимость заказа</span>
                <div className="w-full h-[2px] bg-black" />
                <span className="text-xl sm:text-2xl">{totalSum.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
            </div>
            <CartOrder refetch={refetch} />
        </div>
    )
}