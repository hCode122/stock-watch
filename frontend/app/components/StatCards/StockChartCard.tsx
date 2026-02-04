import { StockChartData } from "@/types/marketTypes"
import { Card,  CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
interface CardProps {
    data: StockChartData | null,
    loading: boolean,
    stocks: string[] | undefined,
    error: string | null,
    selectedStock: string,
    setSelectedStock: React.Dispatch<React.SetStateAction<string>>
}
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

const StockChart = ({data, loading, error, stocks, selectedStock, setSelectedStock} : CardProps) => {
    if (loading) {
        return (
            <Card className="shadow-md flex-1 lg:flex-[0_0_50%] flex justify-center items-center min-h-[21rem] bg-card mt-8">
                fetching data...<Spinner className="size-8 " />
            </Card>
        )
    }

    if (error) {
        return (
         <Card className="shadow-md flex-1 lg:flex-[0_0_50%] flex flex-col justify-center items-center min-h-[21rem] bg-card mt-8 p-8">
            <div className="flex items-start gap-1 max-w-full">
                 <div className="flex items-start gap-3">
                    <span className="rounded-full w-4 h-4 bg-red-600 mt-[0.3em] flex-shrink-0"></span>
                    <p className="text-muted text-left">{error}</p>
                </div>
            </div>
        </Card>
        )
    }

    return (
        <Card className="shadow-md flex flex-col justify-evenly flex-1 lg:flex-[0_0_50%] min-h-[21rem] bg-card mt-8 py-4 px-8">
             <CardTitle className="w-full flex justify-between">
                <p className="text-xl font-[700] text-left">
                    Weekly change chart
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <p className="text-muted">Stock: <Button className="bg-foreground text-background hover:bg-special"
                        variant={'outline'}>{selectedStock}</Button></p> 
                    </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {
                            stocks?.map(stock => (
                                      <DropdownMenuItem onClick={() => setSelectedStock(stock)}>{stock}</DropdownMenuItem>
                            ))
                        }
                      </DropdownMenuContent>
                </DropdownMenu>
            </CardTitle>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                className="w-1/3"
                data={data?.daily_data || []}
                >
                <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#000' }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                    })}
                    padding={{ left: 24, right: 24 }}
                />
                
                <YAxis 
                    tick={{ fill: '#000' }}
                    tickFormatter={(value) => `$${value}`}
                    padding={{ bottom: 9, top: 9 }}
                />
                
                <Tooltip
                    formatter={(value) => [`$${value}`, 'Price']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                
                <Line 
                    type="monotone" 
                    dataKey="price"  
                    stroke="#37a5d1" 
                    strokeWidth={2}
                    dot={{ r: 11, fill: '#69c9efff', stroke: '#40b1ddff', strokeWidth: 2 }}
                    activeDot={{ r: 14 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default StockChart