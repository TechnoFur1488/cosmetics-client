import { useDeleteProductsMutation } from "@/store/apiSlice"
import { Trash } from "lucide-react"

interface Props {
    productId: number
}

export const ProductsDelete = ({ productId }: Props) => {
    const [deleteProduct] = useDeleteProductsMutation()

    const handleCllickDeleteProduct = async (productId: number) => {
        try {
            await deleteProduct(productId).unwrap()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <button onClick={() => handleCllickDeleteProduct(productId)}><Trash /></button>
    )
}