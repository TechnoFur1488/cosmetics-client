import { ContactsPage } from "@/components/shared/contacts-page";
import { Container } from "@/components/shared/container";

export default function PageContacts() {
    return (
        <div className={"mt-[20vh] bg-cover bg-center"} style={{ backgroundImage: "url('3b69742eb38c3cef3c49cfcbe9744657 1.png')" }}>
            <Container className={"flex justify-center items-center"}>
                <ContactsPage />
            </Container>
        </div>
    )
}