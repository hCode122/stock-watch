'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
interface Props {
    navProbs: NavMeta
}

interface NavMeta {
    text: string;
    target: string
}

const NavLink = ({navProbs} : Props) => {
    const currPage = usePathname()
    const isActive = currPage === navProbs.target;
    return <div className={`flex items-center justify-center font-[500] text-lg last:ml-auto
            hover:text-special text-muted transition duration-200 ${isActive? 'text-special' : ''}`}>
        <Link className="" href={navProbs.target}>{navProbs.text}</Link>
    </div>
}

export default NavLink