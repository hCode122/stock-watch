import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { CoinMarketData } from "@/types/marketTypes"
import { Spinner } from "@/components/ui/spinner"
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Coins, Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { useState } from "react"

interface CoinProps {
    coinMarketData: CoinMarketData | null,
    coinMarketLoading: boolean,
    coinMarketError: string | null
}

const CoinMarketOvCard = ({ coinMarketData, coinMarketLoading, coinMarketError }: CoinProps) => {
    const [showFullTable, setShowFullTable] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

    if (coinMarketLoading) {
        return (
            <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
                <div className="flex flex-col items-center gap-2">
                    <Spinner className="size-6 sm:size-8" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Loading crypto data...</p>
                </div>
            </Card>
        )
    }

    if (coinMarketError) {
        return (
            <Card className="shadow-md w-full flex flex-col justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8 p-4 sm:p-8">
                <div className="flex items-start gap-2 max-w-full">
                    <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0"></span>
                    <p className="text-xs sm:text-sm text-muted text-left">{coinMarketError}</p>
                </div>
            </Card>
        )
    }

    if (!coinMarketData) return null;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    const isPositive = (coinMarketData?.market_cap_change_percentage_24h_usd || 0) >= 0;
    
    const pieData = coinMarketData?.percArr?.slice(0, 6) || [];
    const remainingPercent = coinMarketData?.percArr?.slice(6).reduce((sum, item) => sum + (item.change24h || 0), 0) || 0;
    
    const displayData = [...pieData];
    if (coinMarketData?.percArr && coinMarketData.percArr.length > 6) {
        displayData.push({ coin: 'Others', change24h: remainingPercent });
    }

    const formatNumber = (num: number) => {
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <Card className="shadow-md w-full bg-card mt-4 sm:mt-8 overflow-hidden">
            <div className="sticky top-0 bg-card z-10 border-b border-border">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-primary" />
                            <p className="text-sm sm:text-lg md:text-xl font-bold">Crypto Market</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            <span>{coinMarketData?.active_cryptocurrencies?.toLocaleString()} coins</span>
                        </div>
                    </div>
                </CardTitle>
            </div>
            
            <CardContent className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground mb-1 sm:mb-2">
                            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Active Coins</span>
                        </div>
                        <p className="text-sm sm:text-2xl font-bold">{formatNumber(coinMarketData?.active_cryptocurrencies || 0)}</p>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground mb-1 sm:mb-2">
                            {isPositive ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                            <span className="text-xs sm:text-sm">24h Change</span>
                        </div>
                        <div className={`flex items-baseline gap-1 sm:gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            <p className="text-sm sm:text-2xl font-bold">
                                {Math.abs(coinMarketData?.market_cap_change_percentage_24h_usd || 0).toFixed(1)}%
                            </p>
                            {isPositive ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-1 h-4 sm:h-5 bg-primary rounded-full" />
                        <p className="font-semibold text-sm sm:text-base">Market Cap Distribution</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 sm:gap-6">
                        {/* Responsive Pie Chart */}
                        <div className="w-full max-w-[280px] sm:max-w-[350px] mx-auto">
                            <ResponsiveContainer width="100%" height={250} aspect={1}>
                                <PieChart>
                                    <Pie
                                        data={displayData}
                                        dataKey="change24h"
                                        nameKey="coin"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={window.innerWidth < 640 ? 90 : 130}
                                        innerRadius={window.innerWidth < 640 ? 35 : 50}
                                        paddingAngle={2}
                                        isAnimationActive={true}
                                    >
                                        {displayData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={index < COLORS.length ? COLORS[index] : '#8884d8'} 
                                                stroke="hsl(var(--background))"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `${Number(value).toFixed(1)}%`}
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--popover))', 
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            padding: '6px 10px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="w-full max-h-[200px] overflow-y-auto space-y-1.5 sm:space-y-2 pr-1">
                            {coinMarketData?.percArr?.slice(0, 10).map((item, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between gap-2 text-xs sm:text-sm hover:bg-muted/30 p-1 rounded cursor-pointer transition-colors"
                                    onClick={() => setSelectedCoin(selectedCoin === item.coin ? null : item.coin)}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                        <div 
                                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="font-medium truncate">{item.coin}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                        <div className="w-12 sm:w-24 bg-muted rounded-full h-1 sm:h-1.5 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${Math.min(item.change24h, 100)}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            />
                                        </div>
                                        <span className="text-muted-foreground text-right w-10 sm:w-12">
                                            {item.change24h?.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div 
                        className="flex items-center justify-between gap-2 mb-3 sm:mb-4 cursor-pointer sm:cursor-default"
                        onClick={() => setShowFullTable(!showFullTable)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 sm:h-5 bg-primary rounded-full" />
                            <p className="font-semibold text-sm sm:text-base">Market Cap Breakdown</p>
                        </div>
                        <button className="sm:hidden text-xs text-muted-foreground flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {showFullTable ? 'Show less' : 'Show more'}
                        </button>
                    </div>
                    
                    <div className={`overflow-x-auto rounded-lg border ${!showFullTable && 'hidden sm:block'}`}>
                        <table className="w-full text-xs sm:text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">#</th>
                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Coin</th>
                                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium">Market Cap %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coinMarketData?.percArr?.slice(0, showFullTable ? 20 : 5).map((item, index) => (
                                    <tr key={index} className="border-t hover:bg-muted/30 transition-colors">
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-muted-foreground text-xs">#{index + 1}</td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div 
                                                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" 
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="font-medium text-xs sm:text-sm">{item.coin}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono text-xs sm:text-sm">
                                            {item.change24h?.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {!showFullTable && coinMarketData?.percArr && coinMarketData.percArr.length > 5 && (
                        <button 
                            onClick={() => setShowFullTable(true)}
                            className="sm:hidden w-full mt-2 text-center text-xs text-muted-foreground py-2 hover:text-primary transition-colors"
                        >
                            + {coinMarketData.percArr.length - 5} more coins
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default CoinMarketOvCard