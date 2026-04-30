'use client'

import { useState } from "react"
import { useGetLatestCoin } from "@/hooks/useGetLatestCoin"
import LatestCoinsCard from "../StatCards/LatestCoinsCard"
import { useGetCoinMarketOvData } from "@/hooks/useGetCoinMarketOvData"
import CoinMarketOvCard from "../StatCards/CoinMarketOvCard"
import { Button } from "@/components/ui/button"
import { ArrowBigUp } from "lucide-react"
import BuyDialog from "../misc/BuyDialog"

interface stockBuyData {
    ticker: string,
    price: number
}

const CryptoIsland = () => {
    const {coinData, coinLoading, coinError} = useGetLatestCoin()
    const {coinMarketData, coinMarketLoading, coinMarketError} = useGetCoinMarketOvData()
    const [buy, setBuy] = useState<stockBuyData | null>(null)

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
              {
                buy != null ? <BuyDialog buy={buy} setBuy={setBuy} assetType="CRYPTO" stock={buy}/> : null
            }
            <div className="flex max-w-full flex-col justify-evenly gap-4 overflow-x-auto">
                <div className="min-w-0 flex-0">
                    <LatestCoinsCard setBuy={setBuy} coinData={coinData} coinError={coinError} coinLoading={coinLoading} />
                </div>
                <div className="min-w-0 flex-1">
                    <CoinMarketOvCard 
                        coinMarketData={coinMarketData} 
                        coinMarketLoading={coinMarketLoading}
                        coinMarketError={coinMarketError} 
                    />
                </div>
            </div>
            <div className="flex justify-center">
            <Button onClick={() => scrollToSection('stock')} className="mx-auto mt-14 py-8 w-42 bg-special"> Back to top <ArrowBigUp className="h-16" /></Button>
            </div>
        </div>
    )
}

export default CryptoIsland