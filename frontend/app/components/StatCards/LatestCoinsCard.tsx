import { LatestCoin } from "@/types/marketTypes"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { PlusCircle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useSelector } from "react-redux"
import { selectAuthState } from "@/state/slices/authSlice"

interface stockBuyData {
    ticker: string,
    price: number
}

interface CoinProps {
    coinData: LatestCoin[] | null,
    coinLoading: boolean,
    coinError: string | null,
    setBuy: Dispatch<SetStateAction<stockBuyData | null>>
}

const toNumber = (value: number | string | undefined): number => {
    if (value === undefined || value === null) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
};

const LatestCoinsCard = ({ coinData, coinLoading, coinError, setBuy }: CoinProps) => {
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const isAuthorized = useSelector(selectAuthState)
    if (coinLoading) {
        return (
            <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
                <div className="flex flex-col items-center gap-2">
                    <Spinner className="size-6 sm:size-8" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Loading crypto data...</p>
                </div>
            </Card>
        )
    }

    if (coinError) {
        return (
            <Card className="shadow-md w-full flex flex-col justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8 p-4 sm:p-8">
                <div className="flex items-start gap-2 max-w-full">
                    <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0"></span>
                    <p className="text-xs sm:text-sm text-muted text-left">{coinError}</p>
                </div>
            </Card>
        )
    }

    if (!coinData || coinData.length === 0) {
        return (
            <Card className="shadow-md w-full bg-card mt-4 sm:mt-8">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4 border-b">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <p className="text-sm sm:text-lg md:text-xl font-bold">Top Cryptocurrencies</p>
                    </div>
                </CardTitle>
                <CardContent className="p-6">
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No cryptocurrency data available
                    </div>
                </CardContent>
            </Card>
        )
    }

    // ✅ Safe format number
    const formatNumber = (value: number | string | undefined): string => {
        const num = toNumber(value);
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toString();
    };

    // ✅ Safe format price (handles string or number)
    const formatPrice = (value: number | string | undefined): string => {
        const numPrice = toNumber(value);
        if (numPrice === 0) return '$0.00';
        
        if (numPrice < 0.01) return `$${numPrice.toFixed(6)}`;
        if (numPrice < 1) return `$${numPrice.toFixed(4)}`;
        if (numPrice < 100) return `$${numPrice.toFixed(2)}`;
        return `$${numPrice.toFixed(0)}`;
    };

    // ✅ Safe get percentage
    const getPercentage = (value: number | string | undefined): number => {
        return toNumber(value);
    };

    const displayData = showAll ? coinData : coinData.slice(0, 5);

    return (
        <Card className="shadow-md w-full flex flex-col bg-card mt-4 sm:mt-8 overflow-hidden">
            <div className="sticky top-0 bg-card z-10 border-b border-border">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <p className="text-sm sm:text-lg md:text-xl font-bold">
                                Top Cryptocurrencies
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>Last 24h</span>
                        </div>
                    </div>
                </CardTitle>
            </div>

            <CardContent className="p-0 overflow-x-auto">
                {/* Mobile Card View */}
                <div className="block sm:hidden divide-y divide-border">
                    {displayData.map((coin, index) => {
                        const percentChange = getPercentage(coin.percent_change_24h);
                        const isPositive = percentChange >= 0;
                        const isExpanded = expandedCoin === coin.coin_symbol;
                        
                        return (
                            <div key={coin.coin_symbol} className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-xs text-muted-foreground w-6">#{index + 1}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-semibold text-sm truncate">{coin.coin_symbol}</p>
                                                <p className="text-xs text-muted-foreground truncate hidden xs:block">
                                                    {coin.coin_name}
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Vol: {formatNumber(coin.volume_24h)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="font-mono text-sm font-medium">
                                            {formatPrice(coin.price)}
                                        </p>
                                        <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {Math.abs(percentChange).toFixed(2)}%
                                        </p>
                                    </div>
                                    
                                    <PlusCircle 
                                        onClick={() => setBuy({ ticker: coin.coin_symbol, price: toNumber(coin.price) })} 
                                        className="cursor-pointer text-green-400 h-5 w-5 flex-shrink-0 ml-2 hover:scale-110 transition-transform" 
                                    />
                                </div>
                                
                                {isExpanded && (
                                    <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Market Cap:</span>
                                            <p className="font-mono">${formatNumber(coin.market_cap)}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Volume 24h:</span>
                                            <p className="font-mono">${formatNumber(coin.volume_24h)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Name:</span>
                                            <p className="truncate">{coin.coin_name}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => setExpandedCoin(isExpanded ? null : coin.coin_symbol)}
                                    className="w-full mt-2 text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {isExpanded ? 'Show less' : 'Show details'}
                                </button>
                            </div>
                        );
                    })}
                    
                    {coinData.length > 5 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full py-3 text-center text-sm text-primary hover:underline transition-colors border-t"
                        >
                            {showAll ? 'Show less' : `Show ${coinData.length - 5} more coins`}
                        </button>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-muted font-medium text-xs md:text-sm w-12">#</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Coin</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm text-right">Price</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm text-right">Volume</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm text-right">Change</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm text-right">Market Cap</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coinData.slice(0, showAll ? coinData.length : 10).map((coin, index) => {
                                const percentChange = getPercentage(coin.percent_change_24h);
                                const isPositive = percentChange >= 0;
                                
                                return (
                                    <TableRow key={coin.coin_symbol} className="hover:bg-muted/30">
                                        <TableCell className="font-mono text-xs">#{index + 1}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{coin.coin_symbol}</p>
                                                <p className="text-xs text-muted-foreground">{coin.coin_name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-sm">
                                            {formatPrice(coin.price)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            ${formatNumber(coin.volume_24h)}
                                        </TableCell>
                                        <TableCell className={`text-right text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                            {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            ${formatNumber(coin.market_cap)}
                                        </TableCell>
                                        <TableCell>
                                        { isAuthorized === true &&
                                            <PlusCircle 
                                                onClick={() => setBuy({ ticker: coin.coin_symbol, price: toNumber(coin.price) })} 
                                                className="cursor-pointer text-green-400 h-5 w-5 hover:scale-110 transition-transform" 
                                            />
                                        }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    
                    {coinData.length > 10 && !showAll && (
                        <div className="p-4 text-center border-t">
                            <button
                                onClick={() => setShowAll(true)}
                                className="text-sm text-primary hover:underline"
                            >
                                Show {coinData.length - 10} more coins
                            </button>
                        </div>
                    )}
                </div>
            </CardContent>

            <div className="border-t border-border px-3 sm:px-4 py-2 sm:py-3 bg-muted/5">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            {coinData.filter(c => getPercentage(c.percent_change_24h) > 0).length} gainers
                        </span>
                        <span className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            {coinData.filter(c => getPercentage(c.percent_change_24h) < 0).length} losers
                        </span>
                    </div>
                    <div>
                        Range: {formatPrice(Math.min(...coinData.map(c => toNumber(c.price))))} - {formatPrice(Math.max(...coinData.map(c => toNumber(c.price))))}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default LatestCoinsCard