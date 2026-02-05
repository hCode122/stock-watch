'use client'
import axios from "axios"
import { useState, useEffect } from "react"
import { StockMarketOV } from "@/types/marketTypes"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useGetTopMarketOV = () => {
   const [stockMarketState, setStockOV] = useState<{
    stockMarketOV: StockMarketOV[] | null,
    marketLoading: boolean,
    marketError: string | null
   }>({
    stockMarketOV: null,
    marketLoading: true,
    marketError: null
   })

    useEffect(() => {
        const fetchData = async () => {
                try {
                    const response = await axios.get(`${API_BASE}/api/market/marketStock`)
                    if (response.data.success) {
                        const dataObject : StockMarketOV[] = response.data.data
                        setStockOV({
                            stockMarketOV: dataObject,
                            marketLoading: false,
                            marketError: null
                        })

                    } else {
                        setStockOV({
                            stockMarketOV: null,
                            marketLoading: false,
                            marketError: response.data.message || "API request failed" 
                        })
                    }
                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                if (error.response) {
                    setStockOV({
                        stockMarketOV: null,
                        marketLoading: false,
                        marketError: `Server error: ${error.response.status}`
                    });
                }} else {
                    setStockOV({
                        stockMarketOV: null,
                        marketLoading: false,
                        marketError: "An unexpected error occurred"
                    });
                }
            }}
        fetchData()
    }, [])
    return stockMarketState
}