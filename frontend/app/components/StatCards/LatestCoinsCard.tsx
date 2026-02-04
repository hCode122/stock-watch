import { LatestCoin } from "@/types/marketTypes"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

interface CoinProps {
    coinData: LatestCoin[] | null,
    coinLoading: boolean,
    coinError: string | null
}

const LatestCoinsCard = ({coinData, coinLoading, coinError} : CoinProps) => {
    const colNames = ['', 'Coin', 'Price', 'Volume', 'Change perc', 'Market cap'] 
    if (coinLoading) {
            return (
                <Card className="shadow-md w-1/2 flex justify-center items-center min-h-[21rem] bg-card mt-8">
                    fetching data...<Spinner className="size-8 " />
                </Card>
            )
        }
    
        if (coinError) {
            return (
             <Card className="shadow-md w-1/2 flex flex-col justify-center items-center min-h-[21rem] bg-card mt-8 p-8">
                <div className="flex items-start gap-1 max-w-full">
                     <div className="flex items-start gap-3">
                        <span className="rounded-full w-4 h-4 bg-red-600 mt-[0.3em] flex-shrink-0"></span>
                        <p className="text-muted text-left">{coinError}</p>
                    </div>
                </div>
            </Card>
            )
        }

        return (
            <Card className="shadow-md flex-col flex-3 items-start min-h-[21rem] bg-card mt-8 gap-4 overflow-x-scroll">
                <CardTitle className="w-full px-4">
                    <p className="text-xl font-[700] text-left">
                        Top Cryptocurrencies In The Last 24h
                    </p>
                </CardTitle>
                 <CardContent className="">
                <Table className="table-auto text-[0.6rem] sm:text-[0.92rem] md:text-[1.1rem] lg:text-[0.8rem] ">
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
                            coinData?.map((rowData, index) => (
                                <TableRow>
                                    <TableCell>
                                        <p>{Number(index)+1}</p>
                                    </TableCell>
                                    {
                                        Object.entries(rowData)
                                        .filter(([key]) =>key != 'coin_id' && key != 'coin_name' && key != 'date' &&  key != 'slug' )
                                        .map(([key, value]) => (
                                            <TableCell key={`${rowData.slug}-${key}`}>
                                                <p className={
                                                    key === 'percent_change_24h' 
                                                        ? (Number(value) < 0 ? 'text-red-600' : 'text-green-700')
                                                        : ''
                                                }>
                                                    {key === 'percent_change_24h' ? value + '%' :
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

export default LatestCoinsCard