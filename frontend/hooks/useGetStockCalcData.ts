import { StockMarketCalcs } from "@/types/marketTypes"
import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useGetStockCalcData = () => {
    const [stockCalcState, setCalcs] = useState<{
        calcData: StockMarketCalcs[] | null,
        calcLoading: boolean,
        calcError: string | null
    }>({
        calcData: null,
        calcLoading: true,
        calcError: null
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/market/stockCalc`)

                if (response.data.success) {
                    setCalcs({
                        calcData: response.data.data,
                        calcLoading: false,
                        calcError: null
                    })
                }
                else {
                    setCalcs({
                        calcData: null,
                        calcLoading: false,
                        calcError: response.data.message || "API request failed" 
                    })
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                if (error.response) {
                    setCalcs({
                        calcData: null,
                        calcLoading: false,
                        calcError: `Server error: ${error.response.status}`
                    });
                }} else {
                    setCalcs({
                        calcData: null,
                        calcLoading: false,
                        calcError: `An unexpected error occurred`
                    });
                }
            }
        }
        fetchData()
    }, [])

    return stockCalcState
}