import { Dialog, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Dispatch } from "react"
import { SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { selectBalance, setBalance } from "@/state/slices/authSlice"
import { usePurchase } from "@/hooks/usePurchase"
import { toast } from "sonner"

interface stockBuyData {
    ticker: string,
    price: number
}

interface DialogProps {
    stock: stockBuyData,
    setBuy: Dispatch<SetStateAction<stockBuyData | null>>,
    buy : stockBuyData,
    assetType: string
}

const BuyDialog = ({ stock, assetType,  setBuy, buy} : DialogProps) => {
    
    const [amount, setAmount] = useState(1)
    const [total_price, set_total] = useState(0)

    const dispatch = useDispatch()

    const balance = useSelector(selectBalance)
    const [newBalance, setNewBalance] = useState(0)
    const { purchase, isLoading, error, data } = usePurchase();

    useEffect(() => {
        const total = stock.price * amount
        set_total(Number(total.toFixed(2)))
        setNewBalance(balance - total)
    }, [amount])

    const onSubmit = async () => {
        try {
            const result = await purchase({
                assetType: assetType,
                transactionType: "BUY",
                name: buy.ticker,
                amount: amount,
                currPrice: buy.price,
            });
            
            newBalance > 0 && dispatch(setBalance(newBalance));
            toast.success('Purchase successful!');
            console.log('Purchase result:', result);
            
        } catch (error) {
            toast.error('Purchase failed');
        }
    }

    return (
        <Dialog open={true} onOpenChange={(open) => {
            if (!open) setBuy(null)
        }}>
            <DialogContent className=" flex flex-col items-center">
                <div className="flex items-center mb-4">
                    <p className="font-light">Current Balance: {balance}$</p>
                </div>
                <div className="flex justify-evenly items-center gap-8">
                    <p>{stock.ticker}</p>

                    <form className="flex gap-4 items-center" >
                            <MinusCircle onClick={() => {setAmount(amount - 1)}} />
                                <Input style={{borderColor: "#413b3b"}} 
                                value={amount} onChange={(e) => {setAmount(Number(e.target.value))}} type="numeric" className="w-16" />
                            <PlusCircle onClick={() => {setAmount(amount + 1)}}/>
                     
                    </form>
                </div>
                <div className="flex items-center justify-center">
                   <p className={total_price > balance ? "text-red-500" : ''}> {total_price}$ </p>
                </div>
                   <DialogFooter>
                            <DialogClose asChild>
                                <Button onClick={() => {setBuy(null)}} variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={() => onSubmit()}>Purchase</Button>
                        </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BuyDialog