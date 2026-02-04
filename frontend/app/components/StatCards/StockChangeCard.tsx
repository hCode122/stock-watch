'use client'

import { Card, CardContent, CardAction, CardTitle } from "@/components/ui/card"
import { TopStockItem } from "@/types/marketTypes"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CardProps {
    data: TopStockItem[] | undefined,
    type: string,
    loading: boolean,
    error: string | null
}

export const StockChangeCard = ( {data, type, loading, error} : CardProps) => {
    const colNames = ['', 'Stock', 'Price', 'Change amt', 'Change perc', 'Volume']
    if (loading) {
        return (
            <Card className="shadow-md flex-1 flex items-center min-h-[21rem] bg-card mt-8">
                fetching data...<Spinner className="size-8 " />
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="shadow-md w-1/2 flex flex-col justify-center items-center min-h-[21rem] bg-card mt-8 p-8">
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
        <Card className="shadow-md flex-1 flex-col items-start min-h-[21rem] bg-card mt-8 gap-4 overflow-x-auto">
            <CardTitle className="w-full px-4">
                
                    {
                        type == 'gainer' ?
                        <p className="text-md sm:text-xl font-[700] text-left">
                            Top gainers in the last 24h
                        </p>
                        : type == 'looser' ?
                        <p className="text-md sm:text-xl font-[700] text-left">
                            Top loosers in the last 24h
                        </p>
                        :
                        <p className="text-md sm:text-xl font-[700] text-left">
                            Most traded in the last 24h
                        </p>
                        
                    }
                
            </CardTitle>
            <CardContent className="">
                <Table className=" text-[0.75rem] sm:text-[0.92rem] md:text-[1.1rem] lg:text-[0.8rem]">
                    <TableHeader>
                        {
                            colNames.map(name => (
                                <TableHead className="w-24 text-muted font-[400]">
                                    <TableCell className="p-0">
                                    {name}
                                    </TableCell>
                                </TableHead>
                            ))
                        }
                    </TableHeader>
                    <TableBody className="">
                        {
                            data?.map((rowData, index) => (
                                <TableRow>
                                    <TableCell>
                                        <p>{Number(index)+1}</p>
                                    </TableCell>
                                    {
                                        Object.entries(rowData)
                                        .filter(([key]) => key !== 'id' && key !== 'date')
                                        .map(([key, value]) => (
                                            <TableCell key={`${rowData.id}-${key}`}>
                                                <p className={
                                                    key === 'change_percentage' 
                                                        ? (Number(value) < 0 ? 'text-red-600' : 'text-green-700')
                                                        : ''
                                                }>
                                                    {key === 'change_percentage' ? value + '%' :
                                                    key === 'price' ? '$' + value : value}
                                                </p>
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>       
            </CardContent>
        </Card>
    )
}