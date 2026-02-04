import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { CoinMarketData } from "@/types/marketTypes"
import { Spinner } from "@/components/ui/spinner"
import { ResponsiveContainer, LabelList, Tooltip, PieChart, Pie, Cell } from "recharts"
interface CoinProps {
    coinMarketData: CoinMarketData | null,
    coinMarketLoading: boolean,
    coinMarketError: string | null
}

const CoinMarketOvCard = ({coinMarketData, coinMarketLoading, coinMarketError} : CoinProps) => {
    
    const colNames = ['', 'Coin', 'Price', 'Volume', 'Change perc', 'Market cap'] 
    
   

    if (coinMarketLoading) {
            return (
                <Card className="shadow-md w-1/2 flex justify-center items-center min-h-[21rem] bg-card mt-8">
                    fetching data...<Spinner className="size-8 " />
                </Card>
            )
        }
    
        if (coinMarketError) {
            return (
             <Card className="shadow-md w-1/2 flex flex-col justify-center items-center min-h-[21rem] bg-card mt-8 p-8">
                <div className="flex items-start gap-1 max-w-full">
                     <div className="flex items-start gap-3">
                        <span className="rounded-full w-4 h-4 bg-red-600 mt-[0.3em] flex-shrink-0"></span>
                        <p className="text-muted text-left">{coinMarketError}</p>
                    </div>
                </div>
            </Card>
            )
        }

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
        return (
            <Card className="shadow-md flex-col flex-2 items-start min-h-[15rem] bg-card mt-8 gap-4 overflow-x-scroll">
                <CardTitle className="w-full px-4">
                    <p className="text-xl font-[700] text-left">
                        Crypto Market Overview
                    </p>
                </CardTitle>
                 <CardContent className="flex flex-col gap-4  mt-2 text-[0.75rem] sm:text-[0.92rem] md:text-[1.1rem] lg:text-[0.8rem]">
                    <p>Active cryptos: {coinMarketData?.active_cryptocurrencies}</p>
                    <p>Market cap change percentage in the last 24h: { coinMarketData?.market_cap_change_percentage_24h_usd}%</p>

                    <p className="">Market cap percentage per cryptocurrency: </p>

                    <ResponsiveContainer width={400} height={400}>
                        <PieChart>
                            <Pie
                                data={coinMarketData?.percArr}
                                dataKey="change24h"
                                nameKey="coin"
                                cx="55%"
                                cy="45%"
                                outerRadius={150}
                                fill="#69c9efff"
                                isAnimationActive={true}
                            >
                                <LabelList 
                                dataKey="coin" 
                                position="outside" 
                                fill="#000" 
                                fontSize={12}
                                fontWeight="bold"
                            />
                              {coinMarketData?.percArr.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
            
          
            </CardContent>
            </Card>
        )
    
}

export default CoinMarketOvCard