'use client'
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StockMarketCalcs } from "@/types/marketTypes"
import { Calculator, TrendingUp, TrendingDown, CircleEllipsis, BarChart3 } from "lucide-react"
import { useState } from "react"

interface CardProps {
    calcData: StockMarketCalcs[] | null,
    calcLoading: boolean,
    calcError: string | null
}

const StockCalcCard = ({ calcData, calcLoading, calcError }: CardProps) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [selectedCalc, setSelectedCalc] = useState<string>('all');

    const calcTypes = calcData ? [...new Set(calcData.map(item => item.calculation))] : [];
    
    const filteredData = selectedCalc === 'all' 
        ? calcData 
        : calcData?.filter(item => item.calculation === selectedCalc);


    const getDisplayName = (calculation: string) => {
    const displayNames: Record<string, string> = {
        'CUMULATIVE_RETURN': 'Cum. Return',
        'CUMULATIVE_RETURNS': 'Cum. Return',
        'MEAN': 'Mean',
        'STDDEV': 'Std Dev',
        'STANDARD_DEVIATION': 'Std Dev',
        'VOLATILITY': 'Vol',
        'SHARPE_RATIO': 'Sharpe',
        'MAX_DRAWDOWN': 'Max DD',
        'ALPHA': 'Alpha',
        'BETA': 'Beta',
        'R_SQUARED': 'R²',
        };
        return displayNames[calculation] || calculation;
    };

    const formatValue = (value: number, calculation: string) => {
        if (calculation === 'CUMULATIVE_RETURN') {
            const asPercent = value * 100;
            return `${asPercent > 0 ? '+' : ''}${asPercent.toFixed(2)}%`;
        }
        if (calculation === 'STDDEV') {
            return `±${value.toFixed(4)}`;
        }
        return value.toFixed(4);
    };

    const getValueColor = (value: number, calculation: string) => {
        if (calculation === 'CUMULATIVE_RETURN') {
            return value >= 0 ? 'text-green-500' : 'text-red-500';
        }
        return 'text-foreground';
    };

    const getCalcIcon = (calc: string) => {
        switch(calc) {
            case 'MEAN': return <CircleEllipsis className="h-3 w-3" />;
            case 'STDDEV': return <BarChart3 className="h-3 w-3" />;
            case 'CUMULATIVE_RETURN': return <TrendingUp className="h-3 w-3" />;
            default: return <Calculator className="h-3 w-3" />;
        }
    };

    const groupedBySymbol = filteredData?.reduce((acc, item) => {
        if (!acc[item.symbol]) acc[item.symbol] = [];
        acc[item.symbol].push(item);
        return acc;
    }, {} as Record<string, typeof filteredData>);

    if (calcLoading) {
        return (
            <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
                <div className="flex flex-col items-center gap-2">
                    <Spinner className="size-6 sm:size-8" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Loading calculations...</p>
                </div>
            </Card>
        )
    }

    if (calcError) {
        return (
            <Card className="shadow-md w-full flex flex-col justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8 p-4 sm:p-8">
                <div className="flex items-start gap-2 max-w-full">
                    <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0"></span>
                    <p className="text-xs sm:text-sm text-muted text-left">{calcError}</p>
                </div>
            </Card>
        )
    }

    if (!calcData || calcData.length === 0) {
        return (
            <Card className="shadow-md w-full flex flex-col bg-card mt-4 sm:mt-8">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-special" />
                        <p className="text-sm sm:text-lg md:text-xl font-bold">ETF Calculations</p>
                    </div>
                </CardTitle>
                <CardContent className="p-6">
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No calculation data available
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-md w-full flex flex-col bg-card mt-4 sm:mt-8 overflow-hidden">
            <div className="sticky top-0 bg-card z-10 border-b border-border">
                <CardTitle className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-special" />
                            <p className="text-sm sm:text-lg md:text-xl font-bold">
                                ETF Calculations
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                onClick={() => setSelectedCalc('all')}
                                className={`px-2 py-1 rounded-md text-xs transition-colors ${
                                    selectedCalc === 'all' 
                                        ? 'bg-special text-white' 
                                        : 'bg-muted/50 hover:bg-muted'
                                }`}
                            >
                                All
                            </button>
                            {calcTypes.map(calc => (
                                <button
                                    key={calc}
                                    onClick={() => setSelectedCalc(calc)}
                                    className={`px-2 py-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
                                        selectedCalc === calc 
                                            ? 'bg-special text-white' 
                                            : 'bg-muted/50 hover:bg-muted'
                                    }`}
                                >
                                    {getCalcIcon(calc)}
                                    {calc}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardTitle>
            </div>

            <CardContent className="p-0 overflow-x-auto">
                <div className="block sm:hidden divide-y divide-border">
                    {Object.entries(groupedBySymbol || {}).map(([symbol, calculations], groupIndex) => (
                        <div key={symbol} className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium bg-primary/10 px-2 py-0.5 rounded">
                                        {symbol}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {calculations.length} metrics
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {calculations.map((calc, idx) => (
                                    <div
                                        key={`${symbol}-${calc.calculation}`}
                                        className="flex-1 min-w-[120px] bg-muted/30 rounded-lg p-2"
                                    >
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                            {getCalcIcon(calc.calculation)}
                                            <span>{ getDisplayName(calc.calculation)}</span>
                                        </div>
                                        <p className={`text-sm font-mono font-semibold ${getValueColor(calc.value, calc.calculation)}`}>
                                            {formatValue(calc.value, calc.calculation)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                    <Table className="min-w-[500px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-muted font-medium text-xs md:text-sm w-12">#</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Symbol</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm">Calculation</TableHead>
                                <TableHead className="text-muted font-medium text-xs md:text-sm text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.map((rowData, index) => (
                                <TableRow key={`${rowData.etf_id}-${rowData.calculation}`} className="hover:bg-muted/30">
                                    <TableCell className="font-mono text-xs">#{index + 1}</TableCell>
                                    <TableCell className="font-medium text-sm">
                                        <span className="bg-primary/10 px-2 py-0.5 rounded text-xs">
                                            {rowData.symbol}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {getCalcIcon(rowData.calculation)}
                                            <span className="text-sm">{rowData.calculation}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`text-right font-mono text-sm font-medium ${getValueColor(rowData.value, rowData.calculation)}`}>
                                        {formatValue(rowData.value, rowData.calculation)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <div className="border-t border-border px-3 sm:px-4 py-2 sm:py-3 bg-muted/5">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calculator className="h-3 w-3" />
                        <span>{filteredData?.length || 0} calculations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{calcTypes.length} metric types</span>
                        <span>•</span>
                        <span>{Object.keys(groupedBySymbol || {}).length} ETFs</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default StockCalcCard