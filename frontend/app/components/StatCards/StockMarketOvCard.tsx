import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { StockMarketOV } from "@/types/marketTypes"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Building2, Globe, Clock, MapPin } from "lucide-react"
import { useState } from "react"

interface CardProps {
    data: StockMarketOV[] | null,
    loading: boolean,
    error: string | null
}

export const StockMarketOvCard = ({ data, loading, error }: CardProps) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const getStatusInfo = (status: string) => {
        const isOpen = status?.toLowerCase() === 'open';
        return {
            color: isOpen ? 'text-green-500' : 'text-red-500',
            bgColor: isOpen ? 'bg-green-500/10' : 'bg-red-500/10',
            text: isOpen ? 'Open' : 'Closed',
            icon: isOpen ? <Clock className="h-3 w-3" /> : <Clock className="h-3 w-3" />
        };
    };

    const formatTime = (time: string) => {
        if (!time) return '—';
        if (time.includes(':')) {
            return time.split(':').slice(0, 2).join(':');
        }
        return time;
    };

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

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-md w-full mt-6 flex flex-col bg-card mt-4 sm:mt-8">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-special" />
                        <p className="text-sm sm:text-lg md:text-xl font-bold">Stock Market Overview</p>
                    </div>
                </CardTitle>
                <CardContent className="p-6">
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No market data available
                    </div>
                </CardContent>
            </Card>
        )
    }

    const uniqueMarkets = new Set(data.map(item => item.market_type)).size;

    return (
        <Card className="shadow-md w-full flex flex-col bg-card mt-4 sm:mt-8 overflow-hidden">
            <div className="sticky top-0 bg-card z-10 border-b border-border">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-special" />
                            <p className="text-sm sm:text-lg md:text-xl font-bold">
                                Stock Market Overview
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <span>{uniqueMarkets} markets</span>
                        </div>
                    </div>
                </CardTitle>
            </div>

            <CardContent className="p-0 overflow-x-auto">
                <div className="block sm:hidden divide-y divide-border">
                    {data?.map((rowData, index) => {
                        const statusInfo = getStatusInfo(rowData.current_status);
                        
                        return (
                            <div 
                                key={rowData.id} 
                                className="p-3 hover:bg-muted/30 transition-colors"
                                onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium bg-muted/50 px-2 py-0.5 rounded">
                                                #{index + 1}
                                            </span>
                                            <p className="font-semibold text-sm">{rowData.market_type}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            <span>{rowData.region}</span>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                        {statusInfo.text}
                                    </div>
                                </div>
                                
                                {expandedRow === index && (
                                    <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Local Open:</span>
                                            <p className="font-mono">{formatTime(rowData.local_open)}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Local Close:</span>
                                            <p className="font-mono">{formatTime(rowData.local_close)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Exchange:</span>
                                            <p className="truncate">{rowData.primary_exchanges}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Desktop Table View (hidden on mobile) */}
                <div className="hidden sm:block overflow-x-auto">
                    <Table className="min-w-[650px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-muted font-medium text-xs md:text-sm w-12">#</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Market Type</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Region</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Local Open</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Local Close</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((rowData, index) => {
                                const statusInfo = getStatusInfo(rowData.current_status);
                                
                                return (
                                    <TableRow key={rowData.id} className="hover:bg-muted/30">
                                        <TableCell className="font-mono text-xs">#{index + 1}</TableCell>
                                        <TableCell className="font-medium text-sm">{rowData.market_type}</TableCell>
                                        <TableCell className="text-sm">{rowData.region}</TableCell>
                                        <TableCell className="font-mono text-sm">{formatTime(rowData.local_open)}</TableCell>
                                        <TableCell className="font-mono text-sm">{formatTime(rowData.local_close)}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                                {statusInfo.icon}
                                                {statusInfo.text}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <div className="border-t border-border px-3 sm:px-4 py-2 sm:py-3 bg-muted/5">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span>Open: {data.filter(m => m.current_status?.toLowerCase() === 'open').length}</span>
                        <span>Closed: {data.filter(m => m.current_status?.toLowerCase() === 'closed').length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}