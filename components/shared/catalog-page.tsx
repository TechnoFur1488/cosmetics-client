"use client"

import { useParams } from "next/navigation"
import { CatalogName } from "./catalog-name"
import { CatalogQuery } from "./catalog-query"
import { Products } from "./products"

export const CatalogPage = () => {
    const router = useParams()
    const catalogId = router.catalogId

    return (
        <>
            <CatalogName catalogId={Number(catalogId)} />
            <CatalogQuery catalogId={Number(catalogId)} />
            <Products catalogId={Number(catalogId)} />
        </>
    )
}