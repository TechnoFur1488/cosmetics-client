import { useDeleteCatalogMutation, useGetAllCatalogQuery } from "@/store/apiSlice"
import Link from "next/link"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { CatalogNameUpdate } from "./catalog-name-update"
import { Trash } from "lucide-react"

export const Catalog = () => {
    const role = useTokenDecryptor()
    const { data, isLoading, isError } = useGetAllCatalogQuery()
    const [deleteCatalog] = useDeleteCatalogMutation()

    const handleClickDeleteCatalog = async (id: number) => {
        try {
            await deleteCatalog(id).unwrap()
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    return (
        <ul className={"flex gap-x-17.5"}>
            {data.catalog.map(el => (
                <li key={el.id} className={"relative"}>
                    {role === "ADMIN" &&
                        <div className={"flex justify-between"}>
                            <CatalogNameUpdate isName={el.name} catalogId={el.id} />
                            <button onClick={() => handleClickDeleteCatalog(el.id)}><Trash /></button>
                        </div>
                    }
                    <Link href={`/catalog/${el.id}`}>{el.name}</Link>
                </li>
            ))}
            <li>
                <Link href={"/sale"}>Распродажа</Link>
            </li>
        </ul>
    )
}