"use client"

import Link from "next/link"
import { Container } from "./container"

export const MainPage = () => {
    return (
        <div className={"min-h-[90vh] flex items-center justify-center"}>
            <div className={"h-[400px] sm:h-[600px] bg-cover bg-center w-full"} style={{ backgroundImage: 'url("/Group 48.png")' }}>
                <Container className={"flex justify-center items-start flex-col h-full px-4 sm:px-0"}>
                    <div className={"flex flex-col items-center"}>
                        <p className={"text-base sm:text-2xl w-full sm:w-[629px] text-center text-white"}>
                            Мы используем только лучшие натуральные ингридиенты, тщательно отобранные со всего мира. Наши формулы разработаны с учетом последних научных достижений в области дерматологии и косметологии, обеспечивая максимальную эффективность и безопасность.
                        </p>
                        <Link 
                            className={"mt-8 sm:mt-17.5 bg-[#93A267] w-full sm:w-[429px] flex items-center justify-center h-12 sm:h-16.5 text-xl sm:text-[32px] px-6 sm:px-33 py-3 sm:py-[19px] rounded-3xl sm:rounded-4xl hover:bg-[#7d8a54] transition-colors"} 
                            href={"/catalog/1"}
                        >
                            Смотреть
                        </Link>
                    </div>
                </Container>
            </div>
        </div>
    )
}