import { useEffect, useState } from "react"
import axios from "axios"
import { StockChartData } from "@/types/marketTypes"
const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY

export const useGetStockChartData = (symbol : string) => {
    const [chartState, setChartData] = useState<{
        stockChartData: StockChartData | null,
        chartLoading: boolean,
        chartError: string | null
    }>({
        stockChartData: null,
        chartLoading: true,
        chartError: null
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData(prev => ({
                    ...prev,
                    chartLoading: true,
                }));
                const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`,
                    {
                        timeout: 20000
                    }
                )
                if (response.status == 200 && !response.data.Information) {
                    const data = response.data
                    if (data['Time Series (Daily)']) {
                    const timeSeries = data['Time Series (Daily)'];
                    let daily_data = [];
                        for (const [date, values] of Object.entries(timeSeries)) {
                            const typedValues = values as {[key: string]: string};
                            const dataObj = {'date': date, price: parseFloat(typedValues['1. open'])}
                            daily_data.push(dataObj)
                        } 
                        daily_data = daily_data.slice(0, 7)
                        setChartData({
                            stockChartData: {symbol, daily_data},
                            chartLoading: false,
                            chartError: null
                        })
                    }
                } else if (response.status == 200 && response.data.Information) {
                    setChartData(prev => ({
                            stockChartData: null,
                            chartLoading: false,
                            chartError: 'Max number of free-tier api calls reached. Pease wait a minute before refreshing.'
                        }))
                } else {
                    setChartData({
                        stockChartData: null,
                        chartLoading: false,
                        chartError: response.data.message || "API request failed"
                    })
                }
            }

            catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        setChartData({
                            stockChartData: null,
                            chartLoading: false,
                            chartError: `Server error: ${error.response.status}`
                        });
                    }} else {
                        setChartData({
                            stockChartData: null,
                            chartLoading: false,
                            chartError: "An unexpected error occurred"
                        });
                    }
            }
        }

        fetchData()
    }, [symbol])
    return chartState
}