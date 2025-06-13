"use client"

import { useGetOneCatalogQuery } from "@/store/apiSlice"

interface Props {
    catalogId: number
}

export const CatalogName = ({ catalogId }: Props) => {
    const { data, isLoading, isError } = useGetOneCatalogQuery(catalogId)

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    return (
        <h1 className={"my-3.5 text-3xl text-center"}>{data?.catalog.name}</h1>
    )
}