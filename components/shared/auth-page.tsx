"use client"

import { useState } from "react"
import { AuthRegistration } from "./auth-registration"
import { AuthLogin } from "./auth-login"

export const AuthPage = () => {
    const [register, setRegister] = useState(false)

    return (
        <div>
            {register ? <AuthRegistration isSetRegister={setRegister} /> : <AuthLogin isSetRegister={setRegister} />}
        </div>
    )
}