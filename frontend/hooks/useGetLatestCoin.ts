import { LatestCoin } from "@/types/marketTypes"
import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useGetLatestCoin = () => {
    const [latestCoinState, setLatestCoinState] = useState<{
        coinData: LatestCoin[] | null,
        coinLoading: boolean,
        coinError: string | null
    }>({
        coinData: null,
        coinLoading: true,
        coinError: null
    })

    useEffect (() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/market/coinsLatest`)
                if (response.data.success) {
                    setLatestCoinState({
                        coinData: response.data.data,
                        coinLoading: false,
                        coinError: null
                    })
                } else {
                    setLatestCoinState({
                        coinData: null,
                        coinLoading: false,
                        coinError: response.data.message || "API request failed" 
                    })
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        setLatestCoinState({
                            coinData: null,
                            coinLoading: false,
                            coinError: `Server error: ${error.response.status}`
                        });
                    }} else {
                        setLatestCoinState({
                            coinData: null,
                            coinLoading: false,
                            coinError: `An unexpected error occurred`
                        });
                    }
            }
        }
        getData()
    }, [])

    return latestCoinState
} 