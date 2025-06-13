import { useDeleteSubCatalogMutation, useGetAllSubCatalogQuery } from "@/store/apiSlice"
import Link from "next/link"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { Trash } from "lucide-react"
import { CatalogUpdateQuery } from "./catalog-update-query"

interface Props {
    catalogId: number
}

export const CatalogQuery = ({ catalogId }: Props) => {
    const role = useTokenDecryptor()
    const { data, isLoading, isError } = useGetAllSubCatalogQuery(catalogId)
    const [deleteSubCatalog] = useDeleteSubCatalogMutation()

    const handleClickDeleteSubCatalog = async (id: number) => {
        try {
            await deleteSubCatalog(id).unwrap()
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 sm:mt-10">
            {data?.catalog.map(el => (
                <div key={el.id} className="relative">
                    <Link 
                        className="w-full h-[75px] bg-[#CBD9A2] rounded-4xl flex items-center justify-center" 
                        href={{ pathname: `/catalog/${catalogId}`, query: { subCatalogId: el.id } }}
                    >
                        <span className="text-xl sm:text-2xl text-center px-4">
                            {el.name}
                        </span>
                    </Link>
                    {role === "ADMIN" &&
                        <div>
                            <button onClick={() => handleClickDeleteSubCatalog(el.id)} className="absolute top-0 right-0 p-2">
                                <Trash className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                            <CatalogUpdateQuery subCatalogId={el.id} catalogId={catalogId} isName={el.name} />
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}