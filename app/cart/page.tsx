"use client"

import { CartPage } from "@/components/shared/cart-page";
import { Container } from "@/components/shared/container";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function PageCart() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/auth")
        }
    }, [router])

    return (
        <Container className={"my-10"}>
            <CartPage />
        </Container>
    )
}