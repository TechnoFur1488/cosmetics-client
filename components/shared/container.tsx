import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

interface Props {
    className?: string
}

export const Container = ({ children, className }: PropsWithChildren<Props>) => {
    return (
        <div className={cn(
            "w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
            "max-w-[1440px] mx-auto",
            className
        )}>
            {children}
        </div>
    )
}