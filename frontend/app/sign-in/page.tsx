import { Card, CardTitle } from "@/components/ui/card"
import { CoinsIcon } from "lucide-react"
import SigninForm from "../components/forms/Signin"
const Signin = () => {

    return (
        <div className="flex h-screen bg-[url('/imgs/auth-bg.jpg')] bg-cover bg-scale bg-no-repeat bg-center text-secondary" >
            <div className="flex-2 gap-2 overflow-x-hidden flex flex-col p-4  justify-center  h-full items-start bg-primary  ">
                
                    <SigninForm />
                    <div className="fixed top-4 left-4 flex gap-1 items-center">
                        <CoinsIcon className="h-10 w-10"/>
                        <p className="font-roboto font-bold text-lg">Stock Watch </p>
                    </div>
                    <div className="fixed bottom-2 left-4 flex gap-1 items-center">
                        <p className="font-light text-sm"> All rights reserved - hCode  2026 - </p> <a className="text-special" href="github.com/hCode122">Github</a>
                    </div>
            </div>
            
            <div className="flex-3 ">

            </div>
        </div>
    )
}

export default Signin