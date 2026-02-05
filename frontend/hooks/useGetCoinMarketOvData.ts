import { useState, useEffect } from "react"
import { CoinMarketData } from "@/types/marketTypes"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useGetCoinMarketOvData = () => {
    const [coinMarketState, setCoinMarketState] = useState<{
        coinMarketData: CoinMarketData | null,
        coinMarketLoading: boolean,
        coinMarketError: string | null
    }>({
        coinMarketData: null,
        coinMarketLoading: true,
        coinMarketError: null
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/market/marketCoins`)
                if (response.data.success) {
                    const apiData = response.data.data[0]
                    const totalSum = Object.values(apiData.total_volume as Record<string, number>)
                    .reduce((sum, value) => sum + value, 0);
                    const percArr = Object.entries(apiData.total_volume as Record<string, number>)
                    .map(([coinName, percentage]) => ({
                        coin: coinName,
                        change24h: parseFloat((percentage / totalSum * 100).toFixed(2)),
                        rawValue: percentage 
                    }))
                    .sort((a, b) => b.rawValue - a.rawValue) 
                    .slice(0, 5) 
                    .map(item => ({
                        coin: item.coin,
                        change24h: item.change24h 
                    }));
                    
                    const respObject = {
                        ...apiData,
                            percArr
                    }
                
                    setCoinMarketState({
                        coinMarketData: respObject,
                        coinMarketLoading: false,
                        coinMarketError: null
                    })
                } else {
                    setCoinMarketState({
                        coinMarketData: null,
                        coinMarketLoading: false,
                        coinMarketError: response.data.message || "API request failed" 
                    })
                }
            } catch (error) {
                console.log(error)
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        setCoinMarketState({
                            coinMarketData: null,
                            coinMarketLoading: false,
                            coinMarketError: `Server error: ${error.response.status}`
                        });
                    }} else {
                        setCoinMarketState({
                            coinMarketData: null,
                            coinMarketLoading: false,
                            coinMarketError: `An unexpected error occurred`
                        });
                    }
            }
        }
        fetchData()
    }, [])

    return coinMarketState
}