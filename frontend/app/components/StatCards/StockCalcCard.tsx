'use client'
import { Card, CardTitle, CardContent } from "@/components/ui/card"
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
import { StockMarketCalcs } from "@/types/marketTypes"

interface CardProps {
    calcData: StockMarketCalcs[] | null,
    calcLoading: boolean,
    calcError: string | null
}

const StockCalcCard =  ({calcData, calcLoading, calcError} : CardProps) => {
    const colNames = ['', 'symbol', 'calculation', 'value']
    
    if (calcLoading) {
        return (
            <Card className="col-span-3 col-span-3 flex h-full flex items-center min-h-[21rem] bg-card mt-8">
                fetching data...<Spinner className="size-8 " />
            </Card>
        )
    }

    if (calcError) {
        return (
            <Card className="shadow-md w-1/2 flex flex-col justify-center items-center min-h-[21rem] bg-card mt-8 p-8">
                <div className="flex items-start gap-1 max-w-full">
                    <div className="flex items-start gap-3">
                        <span className="rounded-full w-4 h-4 bg-red-600 mt-[0.3em] flex-shrink-0"></span>
                        <p className="text-muted text-left">{calcError}</p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="shadow-md  flex-col col-span-3 items-start min-h-[21rem] bg-card mt-8  gap-4 overflow-x-scroll">
            <CardTitle className="w-full px-4">
                <p className="text-xl font-[700] text-left">
                    Stock Calculations
                </p>
            </CardTitle>
            <CardContent className="">
                <Table className="table-auto text-[0.75rem] sm:text-[0.92rem] md:text-[1.1rem] lg:text-[0.8rem] ">
                    <TableHeader>
                        <TableRow>
                        {
                            colNames.map(name => (
                                <TableHead className="w-24 text-muted font-[400]">
                                    {name}
                                </TableHead>
                            ))
                        }
                        </TableRow>
                    </TableHeader>
                    <TableBody className="">
                        {
                            calcData?.map((rowData, index) => (
                                <TableRow>
                                    <TableCell>
                                        <p>{Number(index)+1}</p>
                                    </TableCell>
                                    {
                                        Object.entries(rowData)
                                        .filter(([key]) => key != 'etf_id' && key != 'date' && key != 'primary_exchanges')
                                        .map(([key, value]) => (
                                            <TableCell className="overflow-hidden max-w-72" key={`${rowData.etf_id}-${key}`}>
                                                <p>
                                                    {key == 'value' ? value.toFixed(6) : value}
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

export default StockCalcCard