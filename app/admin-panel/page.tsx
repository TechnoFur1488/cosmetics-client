"use client"

import { Admin } from "@/components/shared/admin";
import { Container } from "@/components/shared/container";
import NotFound from "../not-found";
import { useTokenDecryptor } from "@/components/hooks/use-token-decryptor";

export default function PageSale() {
    const role = useTokenDecryptor()

    return (
        <>
            {role !== "ADMIN"
                ?
                <NotFound />
                :
                <Container className="my-10">
                    <Admin />
                </Container>
            }

        </>
    )
}