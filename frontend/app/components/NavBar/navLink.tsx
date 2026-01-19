import Link from "next/link";

interface Props {
    navProbs: NavMeta
}

interface NavMeta {
    text: string;
    target: string
}

const NavLink = ({navProbs} : Props) => {
    return <div className="flex items-center justify-center font-[500] text-lg last:ml-auto">
        <Link className="" href={navProbs.target}>{navProbs.text}</Link>
    </div>
}

export default NavLink