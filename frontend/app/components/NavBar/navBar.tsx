import { Link } from "lucide-react"
import NavLink from "./navLink"

export const NavBar = () => {
    const navLinkList = [
        {text: "Dashboard", target:"/dashboard"},
        {text: "Market", target:"/market"},
        {text: "My Portfolio", target:"/portfolio"},
        {text: "Watchlist", target:"/watchlist"},
        {text: "Settings", target:"/settings"}
    ]

    return (
        <div className="flex flex-1 justify-start gap-16 min-h-[4rem] ml-16 mr-16 p-2">
            {
                navLinkList.map(link => (
                    <NavLink navProbs={link} />
                ))
            }
        </div>
    )
}