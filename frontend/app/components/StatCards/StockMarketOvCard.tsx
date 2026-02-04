import { Card, CardContent, CardAction, CardTitle } from "@/components/ui/card"
import { StockMarketOV } from "@/types/marketTypes"
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
    data: StockMarketOV[] | null,
    loading: boolean,
    error: string | null
}

export const StockMarketOvCard = ({data, loading, error} : CardProps) => {
    const colNames = ['', 'Market type', 'Region', 'Local open', 'Local close', 'Current status']
    if (loading) {
        return (
            <Card className="col-span-3 col-span-4 flex h-full flex items-center min-h-[21rem] bg-card mt-8">
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
        <Card className="shadow-md  flex-col col-span-4  items-start min-h-[21rem] bg-card mt-8 gap-4 overflow-x-scroll">
            <CardTitle className="w-full px-4">
                <p className="text-md sm:text-xl font-[700] text-left">
                    Stock Market Overview
                </p>
            </CardTitle>
            <CardContent>
                <Table className="table-auto text-[0.55rem] sm:text-[0.92rem] md:text-[1.1rem] lg:text-[0.8rem]">
                    <TableHeader>
                        {
                            colNames.map(name => (
                                <TableHead className="w-24 text-muted font-[400]">
                                    {name}
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
                                        .filter(([key]) => key != 'id' && key != 'date' && key != 'primary_exchanges')
                                        .map(([key, value]) => (
                                            <TableCell className="overflow-hidden max-w-72" key={`${rowData.id}-${key}`}>
                                                <p className={value == 'open' ? 'text-green-700' :
                                                    value == 'closed' ? 'text-red-600' : ''
                                                }>
                                                    {value}
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