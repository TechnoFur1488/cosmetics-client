import { Mail, MapPin, Phone, Send } from "lucide-react"
import Link from "next/link"

export const ContactsPage = () => {
    return (
        <div className="bg-[#AFC07B] w-full sm:w-150 h-auto sm:h-[471px] rounded-2xl sm:rounded-3xl px-6 sm:px-20 py-8 sm:py-10 flex flex-col space-y-6 sm:space-y-0 sm:justify-between">
            <div className="flex space-x-2 items-center text-xl sm:text-3xl">
                <Phone className="h-6 w-6 sm:h-[30px] sm:w-[30px]" />
                <Link href="tel:8 800 555-35-35" className="hover:underline">8 800 555-35-35</Link>
            </div>
            <div className="flex space-x-2 items-center text-lg sm:text-2xl">
                <Mail className="h-6 w-6 sm:h-[30px] sm:w-[30px]" />
                <Link href="mailto:beautyboutiquenatur@mail.ru" className="hover:underline">beautyboutiquenatur@mail.ru</Link>
            </div>
            <div className="flex space-x-2 items-center text-xl sm:text-3xl">
                <Send className="h-6 w-6 sm:h-[30px] sm:w-[30px]" />
                <Link href="https://t.me/beautybotique" className="hover:underline">beautybotique</Link>
            </div>
            <div className="flex space-x-2 items-center text-xl sm:text-3xl">
                <MapPin className="h-6 w-6 sm:h-[30px] sm:w-[30px]" />
                <span>Москва, ул.Хорошева 22</span>
            </div>
        </div>
    )
}