import { Container } from "@/components/shared/container";
import { SalePage } from "@/components/shared/sale-page";

export default function PageSale() {
    return (
        <>
            <div className="h-30 mb-30 flex justify-center items-center" style={{ backgroundImage: "url('/76700be74dee24942229dbb2c7983248 1.png')" }}>
            <span className={"font-bold text-3xl"}>Распродажа</span>
            </div>
            <Container className={""}>
                <SalePage />
            </Container>
        </>
    )
}