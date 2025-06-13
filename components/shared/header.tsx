"use client"

import Image from "next/image"
import { Catalog } from "./catalog"
import { Container } from "./container"
import Link from "next/link"
import { ShoppingCart, User, Phone, Settings } from "lucide-react"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"

export const Header = () => {
    const role = useTokenDecryptor()

    return (
        <header className="sticky top-0 z-50 bg-[#E3E3C9] shadow-sm">
            <Container className="flex items-center justify-between py-3 sm:py-4">
                <nav>
                    <Catalog />
                </nav>

                <Link href="/" className="flex-shrink-0">
                    <Image 
                        src="/logo.png" 
                        alt="Логотип сайта" 
                        width={108} 
                        height={73}
                        className="w-20 h-auto sm:w-24 md:w-[108px]"
                        priority
                    />
                </Link>

                <div className="flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8">
                    <Link 
                        href="/contacts" 
                        className="flex items-center gap-x-2 hover:text-gray-600"
                    >
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="hidden sm:inline text-sm md:text-base">Контакты</span>
                    </Link>
                    {role === "ADMIN" && (
                        <Link 
                            href="/admin-panel" 
                            className="flex items-center gap-x-2 hover:text-gray-600"
                        >
                            <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="hidden sm:inline text-sm md:text-base">Админ панель</span>
                        </Link>
                    )}
                    <div className="flex items-center gap-x-4">
                        <Link 
                            href="/profil"
                            className="hover:text-gray-600"
                        >
                            <User className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Link>
                        <Link 
                            href="/cart"
                            className="hover:text-gray-600"
                        >
                            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    )
}