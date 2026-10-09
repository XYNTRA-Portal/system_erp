import LoginForm from "../components/LoginForm"
import { LoginBackground } from "../components/LoginBackground"

const LoginPage = () => {
    return(
        <main className="relative isolate grid min-h-screen w-full place-items-center m-0 overflow-x-hidden bg-gray-950">
            <LoginBackground />
            <LoginForm />
        </main>
    )
}

export default LoginPage