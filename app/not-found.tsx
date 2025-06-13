import Link from "next/link";

export default function NotFound() {
    return (
        <div className={"h-screen flex justify-center items-center flex-col"}>
            <div className={"flex justify-between w-120 h-15 items-center"}>
                <span className={"font-bold text-3xl"}>404</span>
                <div className={"w-2 h-full bg-black rounded-2xl"} />
                <span className={"font-bold text-2xl"}>Такой страницы не существует</span>
            </div>
            <Link className={"mt-4"} href="/">
                <div className={"bg-green-400  text-black cursor-pointer hover:bg-green-600 transition duration-150 p-4 rounded-2xl"}>
                    Вернуться на главную
                </div>
            </Link>
        </div>
    )
}