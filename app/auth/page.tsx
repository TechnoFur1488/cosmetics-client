import { AuthPage } from "@/components/shared/auth-page";
import { Container } from "@/components/shared/container";

export default function PageAuth() {
    return (
        <Container className={"flex items-center justify-center mt-10"}>
            <AuthPage />
        </Container>
    )
}