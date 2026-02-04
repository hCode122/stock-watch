'use client'

import { useGetLatestCoin } from "@/hooks/useGetLatestCoin"
import LatestCoinsCard from "../StatCards/LatestCoinsCard"
import { useGetCoinMarketOvData } from "@/hooks/useGetCoinMarketOvData"
import CoinMarketOvCard from "../StatCards/CoinMarketOvCard"
import { Button } from "@/components/ui/button"
import { ArrowBigUp } from "lucide-react"

const CryptoIsland = () => {
    const {coinData, coinLoading, coinError} = useGetLatestCoin()
    const {coinMarketData, coinMarketLoading, coinMarketError} = useGetCoinMarketOvData()

        const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div id="stock" className="flex-col w-full gap-4 mt-14">
            <h2 className="text-lg font-[700]">Crypto Market</h2>
            <div className="flex max-w-full flex-col lg:flex-row justify-evenly gap-4">
                    <LatestCoinsCard coinData={coinData} coinError={coinError} coinLoading={coinLoading} />
                    <CoinMarketOvCard coinMarketData={coinMarketData} coinMarketLoading={coinMarketLoading}
                    coinMarketError={coinMarketError} />
            </div>
            <div className="flex justify-center">
            <Button onClick={() => scrollToSection('stock')} className="mx-auto mt-14 py-8 w-42 bg-special"> Back to top <ArrowBigUp className="h-16" /></Button>
            </div>
        </div>
    )
}

export default CryptoIsland