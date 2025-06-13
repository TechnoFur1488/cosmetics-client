import { Catalog } from "@/components/shared/catalog"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Catalog {
    id: number
    name: string
    catalogId?: number
}

interface Product {
    id: number
    img: string
    name: string
    brand: string
    price: number
    discount: number
    catalogId: number
    subCatalogId: number
}

interface Auth {
    name: string
    img: string
    gender: string
    birthday: string
    phone: string
    role: string
    password: string
    token: string
}

interface Cart {
    id: number
    quantity: number
    total: number
    totalDiscount: number
    name: string
    brand: string
    img: string
    productId: number
}

interface PostCart {
    id: number
    quantity: number
    productId: number
}

interface Order {
    id: number
    city: string
    delivery: string
    adress?: string
    comment?: string
    phone: string
    email: string
    name: string
    payment: string
    total: number
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ["Catalog", "SubCatalog", "Products", "User", "Cart", "Order"],
    endpoints: (builder) => ({
        registration: builder.mutation<Auth, Partial<Auth>>({
            query: (user) => ({
                url: "/api/user/registration",
                method: "POST",
                body: user
            }),
            invalidatesTags: ["User"]
        }),
        login: builder.mutation<Auth, Partial<Auth>>({
            query: (user) => ({
                url: "/api/user/login",
                method: "POST",
                body: user
            }),
            invalidatesTags: ["User"]
        }),
        updateUser: builder.mutation<Auth, FormData>({
            query: (formData) => ({
                url: "/api/user/",
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["User"]
        }),
        myUser: builder.query<Auth, void>({
            query: () => "/api/user/me",
            providesTags: ["User"]
        }),

        getAllCatalog: builder.query<{ catalog: Catalog[] }, void>({
            query: () => "/api/catalog",
            providesTags: ["Catalog"]
        }),
        getOneCatalog: builder.query<{ catalog: Catalog }, number>({
            query: (id) => `/api/catalog/${id}`,
            providesTags: ["Catalog"]
        }),
        updateCatalog: builder.mutation<void, { catalogUpdate: { name: string }, id: number }>({
            query: ({ id, catalogUpdate }) => ({
                url: `/api/catalog/${id}`,
                method: "PUT",
                body: catalogUpdate
            }),
            invalidatesTags: ["Catalog"]
        }),
        deleteCatalog: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/catalog/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Catalog"]
        }),
        createCatalog: builder.mutation<void, { newCatalog: Partial<Catalog> }>({
            query: ({ newCatalog }) => ({
                url: "/api/catalog",
                method: "POST",
                body: newCatalog
            }),
            invalidatesTags: ["Catalog"]
        }),

        getAllSubCatalog: builder.query<{ catalog: Catalog[] }, number>({
            query: (catalogId) => `/api/sub-catalog/${catalogId}`,
            providesTags: ["SubCatalog"]
        }),
        deleteSubCatalog: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/sub-catalog/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["SubCatalog"]
        }),
        updateSubCatalog: builder.mutation<{ catalog: Catalog }, { updateCatalog: { name: string, catalogId: number }, id: number }>({
            query: ({ updateCatalog, id }) => ({
                url: `/api/sub-catalog/${id}`,
                method: "PUT",
                body: updateCatalog
            }),
            invalidatesTags: ["SubCatalog"]
        }),
        createSubCatalog: builder.mutation<void, { newSubCatalog: Partial<Catalog> }>({
            query: ({ newSubCatalog }) => ({
                url: `/api/sub-catalog`,
                method: "POST",
                body: newSubCatalog
            }),
            invalidatesTags: ["SubCatalog"]
        }),

        createProducet: builder.mutation<Product, FormData>({
            query: (formData) => ({
                url: '/api/products',
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Products"]
        }),
        getProducts: builder.query<{ product: Product[] }, { catalogId: number, subCatalogId?: number }>({
            query: ({ catalogId, subCatalogId }) => `/api/products/${catalogId}${subCatalogId ? `?subCatalogId=${subCatalogId}` : ''}`,
            providesTags: ["Products"]
        }),
        deleteProducts: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"]
        }),
        updateProducts: builder.mutation<Product, FormData>({
            query: (formData) => ({
                url: `/api/products/${formData.get("id")}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Products"]
        }),

        getSaleProducts: builder.query<{ product: Product[] }, void>({
            query: () => "/api/sale",
            providesTags: ["Products"]
        }),

        postOrder: builder.mutation<{ order: Order }, { newOrder: Partial<Order> }>({
            query: ({ newOrder }) => ({
                url: "/api/order",
                method: "POST",
                body: newOrder
            }),
            invalidatesTags: ["Order"]
        }),
        getOrder: builder.query<{ order: Order[] }, void>({
            query: () => "/api/order",
            providesTags: ["Order"]
        }),

        postCart: builder.mutation<PostCart, { newCart: Partial<PostCart> }>({
            query: ({ newCart }) => ({
                url: "/api/cart",
                method: "POST",
                body: newCart
            }),
            invalidatesTags: ["Cart"]
        }),
        getCart: builder.query<{ cartItem: Cart[] }, void>({
            query: () => "/api/cart",
            providesTags: ["Cart"]
        }),
        updateCart: builder.mutation<void, { updateCartProduct: PostCart }>({
            query: ({ updateCartProduct }) => ({
                url: "/api/cart",
                method: "PUT",
                body: updateCartProduct
            }),
            invalidatesTags: ["Cart"]
        }),
        deleteCart: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/cart/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"]
        })
    })
})

export const {
    useGetAllCatalogQuery,
    useGetOneCatalogQuery,
    useUpdateCatalogMutation,
    useDeleteCatalogMutation,
    useCreateCatalogMutation,

    useRegistrationMutation,
    useLoginMutation,
    useUpdateUserMutation,
    useMyUserQuery,

    useGetAllSubCatalogQuery,
    useDeleteSubCatalogMutation,
    useUpdateSubCatalogMutation,
    useCreateSubCatalogMutation,

    useCreateProducetMutation,
    useGetProductsQuery,
    useDeleteProductsMutation,
    useUpdateProductsMutation,

    useGetSaleProductsQuery,

    useGetCartQuery,
    usePostCartMutation,
    useUpdateCartMutation,
    useDeleteCartMutation,

    usePostOrderMutation,
    useGetOrderQuery
} = apiSlice