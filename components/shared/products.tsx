"use client"

import { useGetProductsQuery } from "@/store/apiSlice"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { CartAdd } from "./cart-add"
import { ProductsDelete } from "./products-delete"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { ProductsUpdate } from "./products-update"

interface Props {
    catalogId: number
}

export const Products = ({ catalogId }: Props) => {
    const searchParam = useSearchParams()
    const subCatalogId = Number(searchParam.get("subCatalogId"))
    const role = useTokenDecryptor()

    const { data, isLoading, isError } = useGetProductsQuery({ catalogId, subCatalogId })

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-16 relative">
            {data.product.map(el => (
                <div key={el.id} className="flex flex-col space-y-2 relative group">
                    <div className="bg-[#D9D9D9] w-full flex items-center justify-center rounded-lg overflow-hidden">
                        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 my-3 w-[90%]">
                            <Image 
                                className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" 
                                src={process.env.NEXT_PUBLIC_APP_API_URL + el.img} 
                                alt={el.name} 
                                fill 
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                priority={false}
                            />
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <h3 className="text-sm sm:text-base md:text-lg font-medium line-clamp-2">{el.name}</h3>
                        <div className="space-y-0.5">
                            <p className="text-base sm:text-lg md:text-xl font-bold">
                                {el.price.toLocaleString("ru-RU", { 
                                    style: "currency", 
                                    currency: "RUB", 
                                    maximumFractionDigits: 0, 
                                    minimumFractionDigits: 0 
                                })}
                            </p>
                            {el.discount !== 0 && (
                                <p className="text-sm sm:text-base text-gray-500 line-through">
                                    {el.discount.toLocaleString("ru-RU", { 
                                        style: "currency", 
                                        currency: "RUB", 
                                        maximumFractionDigits: 0, 
                                        minimumFractionDigits: 0 
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 absolute right-2 top-2">
                        <CartAdd productId={el.id} />
                    </div>
                    {role === "ADMIN" && (
                        <div className="absolute top-2 left-2 p-2 flex space-x-2 bg-white/80 rounded-lg backdrop-blur-sm">
                            <ProductsDelete productId={el.id} />
                            <ProductsUpdate 
                                productId={el.id} 
                                isName={el.name} 
                                isPrice={el.price} 
                                isDiscount={el.discount} 
                                isBrand={el.brand} 
                                isCatalogId={el.catalogId} 
                                isSubCatalogId={el.subCatalogId} 
                                isImg={el.img} 
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}