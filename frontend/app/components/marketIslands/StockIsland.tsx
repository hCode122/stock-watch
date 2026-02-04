'use client'

import { StockChangeCard } from "../StatCards/StockChangeCard"
import { useGetTopStocks } from "@/hooks/useGetTopStocks"
import { StockMarketOvCard } from "../StatCards/StockMarketOvCard"
import { useGetTopMarketOV } from "@/hooks/useGetStockMarketOV"
import StockCalcCard from "../StatCards/StockCalcCard"
import { useGetStockCalcData } from "@/hooks/useGetStockCalcData"
import StockChart from "../StatCards/StockChartCard"
import { useGetStockChartData } from "@/hooks/useGetStockChartData"
import { useState } from "react"

const StockIsland = () => {
    const {topStockData, loading, error} =  useGetTopStocks()
    const {stockMarketOV, marketLoading, marketError} =  useGetTopMarketOV()
    const {calcData, calcLoading, calcError} = useGetStockCalcData()
    const [selectedStock, setSelectedStock] = useState('NAMMW')
    const {stockChartData, chartLoading, chartError} = useGetStockChartData(selectedStock)

    const stocks: string[] | undefined = topStockData?.topGainers.map(stock => stock.ticker)
    return (
        <div id="stock" className="flex-col w-full mt-12 gap-4 ">
            <h2 className="text-lg font-[700]">Stock Market</h2>
            <div className="flex max-w-full flex-col lg:flex-row justify-evenly gap-4">
                <StockChangeCard data={topStockData?.topGainers} type='gainer' loading={loading} error={error} />
                <StockChangeCard data={topStockData?.topLosers} type='looser' loading={loading} error={error}  />
            </div>
            <div className="lg:grid lg:grid-cols-7 gap-4">
                <StockMarketOvCard data={stockMarketOV} loading={marketLoading} error={marketError} />
                <StockCalcCard calcData={calcData} calcLoading={calcLoading} calcError={calcError} />
            </div>
            {/*<div className="flex">
                <StockChart data={stockChartData} loading={chartLoading} error={chartError}
                    stocks={stocks} setSelectedStock={setSelectedStock} selectedStock={selectedStock} />
            </div>*/}
        </div>
    )
}

export default StockIsland