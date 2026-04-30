'use client'

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { TopStockItem } from "@/types/marketTypes"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useSelector } from "react-redux"
import { selectAuthState } from "@/state/slices/authSlice"

interface stockBuyData {
    ticker: string,
    price: number
}

interface CardProps {
    data: TopStockItem[] | undefined,
    type: string,
    loading: boolean,
    error: string | null,
    setBuy: Dispatch<SetStateAction<stockBuyData | null>>
}

export const StockChangeCard = ({ data, type, loading, error, setBuy }: CardProps) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const isAuthorized = useSelector(selectAuthState)
    console.log(isAuthorized)
    const getVisibleColumns = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            return ['', 'Stock', 'Price', 'Change', '']; 
        }
        return ['', 'Stock', 'Price', 'Change amt', 'Change perc', 'Volume', ''];  
    };

    const colNames = getVisibleColumns();

    if (loading) {
        return (
            <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
                <div className="flex flex-col items-center gap-2">
                    <Spinner className="size-6 sm:size-8" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Loading market data...</p>
                </div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="shadow-md w-full flex flex-col justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8 p-4 sm:p-8">
                <div className="flex items-start gap-2 max-w-full">
                    <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0"></span>
                    <p className="text-xs sm:text-sm text-muted text-left">{error}</p>
                </div>
            </Card>
        )
    }

    const getTitle = () => {
        switch(type) {
            case 'gainer':
                return { text: 'Top Gainers', icon: <TrendingUp className="h-4 w-4 text-green-500" />, color: 'text-green-500' };
            case 'looser':
                return { text: 'Top Losers', icon: <TrendingDown className="h-4 w-4 text-red-500" />, color: 'text-red-500' };
            default:
                return { text: 'Most Traded', icon: <BarChart3 className="h-4 w-4 text-special" />, color: 'text-special' };
        }
    };

    const title = getTitle();

    const formatVolume = (volume: number) => {
        if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
        if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
        return volume.toString();
    };

    return (
        <Card className="shadow-md w-full flex flex-col bg-card mt-4 sm:mt-8 overflow-hidden">
            <div className="sticky top-0 bg-card z-10 border-b border-border">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                        {title.icon}
                        <p className="text-sm sm:text-lg md:text-xl font-bold text-left">
                            {title.text}
                        </p>
                        <p className="text-xs text-muted-foreground ml-auto">
                            {data?.length || 0} assets
                        </p>
                    </div>
                </CardTitle>
            </div>

            <CardContent className="p-0 overflow-x-auto">
                <div className="block sm:hidden divide-y divide-border">
                    {data?.map((rowData, index) => {
                        const changePercent = Number(rowData.change_percentage);
                        const isPositive = changePercent >= 0;
                        
                        return (
                            <div 
                                key={rowData.id} 
                                className="p-3 hover:bg-muted/30 transition-colors"
                                onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-xs text-muted-foreground w-6">#{index + 1}</span>
                                        <div>
                                            <p className="font-semibold text-sm">{rowData.ticker}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Vol: {formatVolume(rowData.volume)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm">${Number(rowData.price).toFixed(2)}</p>
                                        <p className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                                        </p>
                                    </div>
                                    { isAuthorized === true &&
                                        <PlusCircle 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBuy({ ticker: rowData.ticker, price: rowData.price });
                                            }} 
                                            className="cursor-pointer text-green-400 h-5 w-5 flex-shrink-0 ml-2 hover:scale-110 transition-transform" 
                                        />
                                    }
                                </div>
                                
                                {expandedRow === index && (
                                    <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Change Amount:</span>
                                            <p className={isPositive ? 'text-green-600' : 'text-red-600'}>
                                                ${Math.abs(Number(rowData.change_amount)).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Volume:</span>
                                            <p>{formatVolume(rowData.volume)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                    <Table className="min-w-[500px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                {colNames.map((name, idx) => (
                                    <TableHead key={idx} className="text-muted font-medium text-xs md:text-sm whitespace-nowrap">
                                        {name}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((rowData, index) => {
                                const changePercent = Number(rowData.change_percentage);
                                const isPositive = changePercent >= 0;
                                
                                return (
                                    <TableRow key={rowData.id} className="hover:bg-muted/30">
                                        <TableCell className="font-mono text-xs">#{index + 1}</TableCell>
                                        <TableCell className="font-medium text-sm">{rowData.ticker}</TableCell>
                                        <TableCell className="font-mono text-sm">${Number(rowData.price).toFixed(2)}</TableCell>
                                        <TableCell className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            ${Math.abs(Number(rowData.change_amount)).toFixed(2)}
                                        </TableCell>
                                        <TableCell className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {formatVolume(rowData.volume)}
                                        </TableCell>
                                        <TableCell>
                                             { isAuthorized === true &&
                                            <PlusCircle 
                                                onClick={() => setBuy({ ticker: rowData.ticker, price: rowData.price })} 
                                                className="cursor-pointer text-green-400 h-5 w-5 hover:scale-110 transition-transform" 
                                            />
                                             }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {(!data || data.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No data available
                    </div>
                )}
            </CardContent>
        </Card>
    )
}