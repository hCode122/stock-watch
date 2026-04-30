'use client'
import { Button } from "@/components/ui/button"
import { NavBar } from "../components/NavBar/navBar"
import CryptoIsland from "../components/marketIslands/CryptoIsland"
import StockIsland from "../components/marketIslands/StockIsland"
import { useSelector } from "react-redux"
import { selectId, selectUsername } from "@/state/slices/authSlice"

const Market = () => {

    return (
        <div className="h-full max-w-full flex-col mx-8 gap-12 pb-16">
            <NavBar />
            <StockIsland />
            <CryptoIsland />    
        </div>
    )
}

export default Market