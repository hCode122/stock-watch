import { Dialog, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MinusCircle, PlusCircle, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { Dispatch } from "react"
import { SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { selectBalance, setBalance } from "@/state/slices/authSlice"
import { useSell } from "@/hooks/useSell"
import { toast } from "sonner"

interface HoldingData {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    currentValue: number;
}

interface DialogProps {
    holding: HoldingData | null;
    setSell: Dispatch<SetStateAction<HoldingData | null>>;
    assetType: 'STOCK' | 'CRYPTO';
    onSuccess: () => void
}

const SellDialog = ({ holding, assetType, setSell, onSuccess }: DialogProps) => {
    const [amount, setAmount] = useState(1)
    const [totalValue, setTotalValue] = useState(0)
    const [futureBalance, setFutureBalance] = useState(0)

    const dispatch = useDispatch()

    const balance = useSelector(selectBalance)
    const { sell, isLoading, error, data } = useSell();

    useEffect(() => {
        if (!holding) return;
        const total = holding.currentPrice * amount;
        const totalValueNum = Number(total.toFixed(2));
        setTotalValue(totalValueNum);
        
        const balanceNum = typeof balance === 'string' ? parseFloat(balance) : balance;
        setFutureBalance(Number((balanceNum + totalValueNum).toFixed(2)));
    }, [amount, holding, balance]);

    const maxQuantity = holding?.quantity || 0;
    const isQuantityValid = amount > 0 && amount <= maxQuantity;

    const handleQuantityChange = (value: number) => {
        if (value >= 1 && value <= maxQuantity) {
            setAmount(value);
        }
    };

    const onSubmit = async () => {
        if (!holding) return;
        
        try {
            const result = await sell({
                assetType: assetType,
                symbol: holding.symbol,
                quantity: amount,
                price: holding.currentPrice,
            });
            dispatch(setBalance({ balance: futureBalance }))
            onSuccess()
            toast.success(`Sold ${amount} ${holding.symbol} successfully!`);
            setSell(null);
            
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Sale failed');
        }
    }

    if (!holding) return null;

    return (
        <Dialog open={true} onOpenChange={(open) => {
            if (!open) setSell(null)
        }}>
            <DialogContent className="flex flex-col items-center bg-card border-border rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-red-500/10">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-lg font-semibold">Sell {holding.symbol}</p>
                </div>

                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-muted-foreground">Current Balance</span>
                        <span className="font-mono font-semibold">${Number(balance).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">{holding.symbol}</p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(amount - 1)}
                                disabled={amount <= 1}
                                className="p-1 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MinusCircle className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min={1}
                                max={maxQuantity}
                            />
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(amount + 1)}
                                disabled={amount >= maxQuantity}
                                className="p-1 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PlusCircle className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg text-sm">
                        <div>
                            <p className="text-muted-foreground">Price per share</p>
                            <p className="font-mono font-semibold">${Number(holding.currentPrice).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Max available</p>
                            <p className="font-mono font-semibold">{holding.quantity} shares</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total value</p>
                            <p className="font-mono font-bold text-green-500">${Number(totalValue).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Future balance</p>
                            <p className="font-mono font-bold text-primary">${Number(futureBalance).toFixed(2)}</p>
                        </div>
                    </div>

                    {!isQuantityValid && amount > 0 && (
                        <p className="text-sm text-red-500 text-center">
                            You only have {maxQuantity} shares available to sell
                        </p>
                    )}
                </div>

                <DialogFooter className="w-full gap-2 mt-4">
                    <DialogClose asChild>
                        <Button onClick={() => setSell(null)} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isLoading || !isQuantityValid}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                        {isLoading ? 'Processing...' : `Sell ${amount} ${holding.symbol}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SellDialog;