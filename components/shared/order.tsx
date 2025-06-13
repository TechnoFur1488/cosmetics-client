import { useGetOrderQuery } from "@/store/apiSlice"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const Order = () => {
    const {data, isLoading, isError} = useGetOrderQuery()

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нет данных</h1>

    return (
        <ScrollArea className="h-[400px] sm:h-[600px] my-6 sm:my-10">
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
                {data.order.map(el => (
                    <Card key={el.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base sm:text-lg font-semibold">
                                    Заказ #{el.id}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Имя:</span>
                                        <span>{el.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Телефон:</span>
                                        <span>{el.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Email:</span>
                                        <span>{el.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Город:</span>
                                        <span>{el.city}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Доставка:</span>
                                        <span>{el.delivery}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Адрес:</span>
                                        <span>{el.adress}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                    <div className="space-y-1">
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {/* {format(new Date(el.createdAt), "d MMMM yyyy, HH:mm", { locale: ru })} */}
                                        </div>
                                        <div className="font-medium text-sm sm:text-base">
                                            Сумма заказа: {el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        Способ оплаты: {el.payment}
                                    </div>
                                </div>
                                {el.comment && (
                                    <div className="mt-2 text-xs sm:text-sm text-gray-600">
                                        <span className="font-medium">Комментарий:</span> {el.comment}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    )
}