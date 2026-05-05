import { CoinsIcon } from "lucide-react"
import SigninForm from "../components/forms/Signin"
import Link from "next/link"

const Signin = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[url('/imgs/auth-bg.jpg')] bg-cover bg-center bg-no-repeat overflow-x-hidden">
            <div className="flex-1 flex flex-col justify-center items-start p-4 sm:p-6 md:p-8  bg-black/95 backdrop-blur-sm md:bg-black/95">
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <CoinsIcon className="h-8 w-8 sm:h-10 sm:w-10 text-special" />
                    <p className="font-bold text-base sm:text-lg text-foreground hidden xs:block">Stock Watch</p>
                </div>

                <div className="w-full max-w-md mx-auto mt-12 sm:mt-16 md:mt-0 px-4">
                    <SigninForm />
                </div>

                <div className="absolute bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-8 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <p className="hidden sm:block">All rights reserved - hCode 2026 -</p>
                    <a 
                        className="text-special hover:underline transition-colors" 
                        href="https://github.com/hCode122" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </div>

            <div className="hidden md:block flex-1 bg-black/20">
            </div>
        </div>
    )
}

export default Signin