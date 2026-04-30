import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TrendingUp, TrendingDown, ArrowLeft, ArrowRight } from "lucide-react";

interface Transaction {
    transaction_id: number;
    type: 'BUY' | 'SELL';
    asset_type: 'STOCK' | 'CRYPTO';
    symbol_name: string;
    quantity: number;
    price_per_share: number;
    total_amount: number;
    transaction_date: string;
}

interface RecentTransactionsCardProps {
    data: Transaction[];
    loading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
}

export const RecentTransactionsCard = ({ data, loading, error, onRefresh }: RecentTransactionsCardProps) => {
    const [transactionLimit, setTransactionLimit] = useState(5);
    const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredTransactions = data?.filter(tx => {
        if (filterType === 'ALL') return true;
        return tx.type === filterType;
    }) || [];

    const displayedTransactions = filteredTransactions.slice(0, transactionLimit);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <Card className="shadow-md w-full bg-card mt-4 sm:mt-8">
                <div className="flex justify-center items-center min-h-[250px]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner className="size-6 sm:size-8" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Loading transactions...</p>
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-md w-full bg-card mt-4 sm:mt-8">
                <div className="flex flex-col justify-center items-center min-h-[250px] p-4 sm:p-8">
                    <div className="flex items-start gap-2">
                        <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-muted text-left">{error}</p>
                    </div>
                    {onRefresh && <Button onClick={onRefresh} variant="outline" className="mt-4">Try Again</Button>}
                </div>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="shadow-md w-full bg-card mt-4 sm:mt-8">
                <CardTitle className="px-3 sm:px-6 pt-4 sm:pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 sm:h-6 bg-primary rounded-full" />
                        <p className="text-base sm:text-xl font-bold">Recent Activity</p>
                    </div>
                </CardTitle>
                <CardContent className="p-4 sm:p-6">
                    <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground">
                        No transactions yet. Start trading to see your activity here!
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-md w-full bg-card mt-4 sm:mt-8">
            <CardTitle className="px-3 sm:px-6 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 sm:h-6 bg-primary rounded-full" />
                        <p className="text-base sm:text-xl font-bold">Recent Activity</p>
                    </div>
                    <div className="flex flex-col sm:flex-row  items-start md:items-center gap-2">
                        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                            <button onClick={() => setFilterType('ALL')} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${filterType === 'ALL' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>All</button>
                            <button onClick={() => setFilterType('BUY')} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md flex items-center gap-1 ${filterType === 'BUY' ? 'bg-green-500 text-white' : 'hover:bg-muted'}`}><TrendingUp className="h-3 w-3" />Buy</button>
                            <button onClick={() => setFilterType('SELL')} className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md flex items-center gap-1 ${filterType === 'SELL' ? 'bg-red-500 text-white' : 'hover:bg-muted'}`}><TrendingDown className="h-3 w-3" />Sell</button>
                        </div>
                        <Select value={transactionLimit.toString()} onValueChange={(v) => setTransactionLimit(Number(v))}>
                            <SelectTrigger className=" sm:w-[100px] h-8 sm:h-10"><SelectValue placeholder="Limit" /></SelectTrigger>
                            <SelectContent><SelectItem value="3">Last 3</SelectItem><SelectItem value="5">Last 5</SelectItem><SelectItem value="7">Last 7</SelectItem></SelectContent>
                        </Select>
                        {!isMobile && (<div className="flex items-center gap-1"><Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => scroll('left')}><ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /></Button><Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => scroll('right')}><ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" /></Button></div>)}
                    </div>
                </div>
            </CardTitle>

            <CardContent className="p-3 sm:p-6">
                <div ref={scrollContainerRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                    {displayedTransactions.map((tx) => (
                        <div key={tx.transaction_id} className="min-w-[215px] md:w-[320px] flex-shrink-0 rounded-lg border bg-card p-3 sm:p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 sm:p-2 rounded-full ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {tx.type === 'BUY' ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm sm:text-lg">{tx.symbol_name}</p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">{tx.asset_type}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                                <div className="flex justify-between text-xs sm:text-sm"><span className="text-muted-foreground">Quantity:</span><span className="font-medium">{tx.quantity}</span></div>
                                <div className="flex justify-between text-xs sm:text-sm"><span className="text-muted-foreground">Price:</span><span className="font-medium">{formatCurrency(tx.price_per_share)}</span></div>
                                <div className="flex justify-between text-xs sm:text-sm"><span className="text-muted-foreground">Total:</span><span className="font-bold">{formatCurrency(tx.total_amount)}</span></div>
                            </div>
                            <div className="pt-2 sm:pt-3 border-t flex items-center justify-between">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">{formatDate(tx.transaction_date)}</p>
                                <div className={`text-[10px] sm:text-xs font-medium ${tx.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{tx.type === 'BUY' ? 'Bought' : 'Sold'}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" /><span>Bought: {filteredTransactions.filter(t => t.type === 'BUY').length}</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" /><span>Sold: {filteredTransactions.filter(t => t.type === 'SELL').length}</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};