import { CatalogCreate } from "./catalog-create"
import { Order } from "./order"
import { ProductsCreate } from "./products-create"

export const Admin = () => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="space-y-8 sm:space-y-12">
                <ProductsCreate />
                <Order />
                <CatalogCreate />
            </div>
        </div>
    )
}