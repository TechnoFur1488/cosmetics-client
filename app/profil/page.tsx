"use client"

import { Container } from "@/components/shared/container";
import { Profil } from "@/components/shared/profil";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PageProfil() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/auth")
        }
    }, [router])

    return (
        <Container className={"my-5"}>
            <h1 className={"text-3xl text-center mb-5"}>Профиль</h1>
            <Profil />
        </Container>
    )
}