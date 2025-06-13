"use client"

import { usePostCartMutation } from "@/store/apiSlice"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
    productId: number
}

export const CartAdd = ({ productId }: Props) => {
    const router = useRouter()
    const [postCart] = usePostCartMutation()

    const post = async (productId: number) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/auth")
            }

            await postCart({ newCart: { productId, quantity: 1 } }).unwrap()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <button onClick={() => post(productId)} className={"absolute right-0 cursor-pointer"}>
            <ShoppingCart />
        </button>
    )
}