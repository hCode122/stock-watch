'use client'
import { useState, useEffect } from "react"
import { TopStockData } from "@/types/marketTypes"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const useGetTopStocks = () => {
    const [topStockState, setTopStocks] = useState<{
        topStockData: TopStockData | null,
        loading: boolean,
        error: string | null
    }>({
        topStockData: {
            topGainers: [],
            topLosers: [],
            mostTraded: []
        },
        loading: true,
        error: null
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                
            const response = await axios.get(`${API_BASE}/api/market/stockChange`)

                if (response.data.success) {
                    const dataObject : TopStockData = response.data.data
                    setTopStocks(prev => ({
                        topStockData: dataObject,
                        loading: false,
                        error: null
                    }))

                    return topStockState
                } else {
                    setTopStocks(prev => ({
                        topStockData: null,
                        loading: false,
                        error: response.data.message || "API request failed" 
                    }))
                }
                
            } catch (error) {
                if (axios.isAxiosError(error)) {
                if (error.response) {
                    setTopStocks({
                        topStockData: null,
                        loading: false,
                        error: `Server error: ${error.response.status}`
                    });
                }} else {
                    setTopStocks({
                        topStockData: null,
                        loading: false,
                        error: "An unexpected error occurred"
                    });
                }
            }}
            fetchData()
        }, [])
    return topStockState
}