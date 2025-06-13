"use client"

import { useGetSaleProductsQuery } from "@/store/apiSlice"
import { CartAdd } from "./cart-add"
import Image from "next/image"
import { ProductsDelete } from "./products-delete"
import { ProductsUpdate } from "./products-update"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"

export const SalePage = () => {
    const role = useTokenDecryptor()
    const { data, isLoading, isError } = useGetSaleProductsQuery()

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    return (
        <div className={"grid grid-cols-4 gap-x-5 gap-y-10 mt-42 relative"}>
            {data.product.map(el => (
                <div key={el.id} className={"flex flex-col space-y-2 relative"}>
                    <div className={"bg-[#D9D9D9] w-full flex items-center justify-center"}>
                        <div className={"relative h-81 my-3 w-[90%]"}>
                            <Image className={"object-cover"} src={process.env.NEXT_PUBLIC_APP_API_URL + el.img} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                    </div>
                    <span className={"text-center"}>{el.name}</span>
                    <span className={"text-xl font-bold text-center"}>{el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    {el.discount !== 0 &&
                        <span className={"text-center line-through"}>{el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    }
                    <CartAdd productId={el.id} />
                    {role === "ADMIN" &&
                        <div className={"absolute p-3"}>
                            <ProductsDelete productId={el.id} /> <ProductsUpdate productId={el.id} isName={el.name} isPrice={el.price} isDiscount={el.discount} isBrand={el.brand} isCatalogId={el.catalogId} isSubCatalogId={el.subCatalogId} isImg={el.img} />
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}