import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { DollarSignIcon, TrendingDown } from "lucide-react";
import { useState } from "react";
import SellDialog from "../misc/SellDialog";

interface PortolioProps {
    holdings: holding[];
    totalValue: number;
}

interface holding {
    avgPrice: number;
    currentPrice: number;
    currentValue: number;
    quantity: number;
    symbol: string;
}

const PortfolioCard = ({ data, error, loading, onSuccess }: { data: PortolioProps; error: string | null; loading: boolean, onSuccess:() => void }) => {
    const [sellHolding, setSellHolding] = useState<holding | null>(null);

    if (error) {
        return (
            <Card className="shadow-md w-full flex flex-col justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8 p-4 sm:p-8">
                <div className="flex items-start gap-2 max-w-full">
                    <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-muted text-left">{error}</p>
                </div>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
                <div className="flex flex-col items-center gap-3">
                    <Spinner className="size-6 sm:size-8" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Loading holdings...</p>
                </div>
            </Card>
        );
    }

    if (!data || !data.holdings || data.holdings.length === 0) {
        return (
            <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
                <p className="text-xs sm:text-sm text-muted-foreground">No holdings yet. Start trading!</p>
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                {data.holdings.map((holding) => (
                    <div key={holding.symbol} className="bg-card rounded-xl border p-3 sm:p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs sm:text-sm">{holding.symbol.charAt(0)}</span>
                                </div>
                                <span className="font-bold text-sm sm:text-lg">{holding.symbol}</span>
                            </div>
                            <button
                                onClick={() => setSellHolding(holding)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                                <DollarSignIcon className="h-7 w-7 text-special rounded-full border-2 border-special p-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Quantity</p>
                                <p className="font-mono font-medium text-xs sm:text-sm">{holding.quantity}</p>
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Avg Price</p>
                                <p className="font-mono font-medium text-xs sm:text-sm">${holding.avgPrice.toFixed(2)}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Total Value</p>
                                <p className="text-sm sm:text-xl font-bold text-primary">${holding.currentValue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {sellHolding && (
                <SellDialog
                    holding={sellHolding}
                    setSell={setSellHolding}
                    assetType="STOCK"
                    onSuccess={onSuccess}
                />
            )}
        </>
    );
};

export default PortfolioCard;