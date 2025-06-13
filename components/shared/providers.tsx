"use client"

import { store } from "@/store/store"
import { PropsWithChildren } from "react"
import { Provider } from "react-redux"
import { Header } from "./header"

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <Header />
            <main>
                {children}
            </main>
        </Provider>
    )
}