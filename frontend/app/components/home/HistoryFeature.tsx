import Image from "next/image"
import { History, Clock, ArrowUpDown, FileText } from "lucide-react"

export const HistoryFeature = () => {
    return (
        <section className="py-14 px-4 md:px-8 bg-gradient-to-t from-black to-gray-950">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-special/10 px-4 py-2 rounded-full">
                            <History className="h-4 w-4 text-special" />
                            <span className="text-special text-sm font-medium">Complete Audit Trail</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Every{" "}
                            <span className="text-special">Transaction</span>
                            {" "}Recorded
                        </h2>
                        
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Never lose track of your trading activity. View your complete transaction history 
                            with buy and sell records, timestamps, and detailed breakdowns of every trade.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <Clock className="h-5 w-5 text-special mb-2" />
                                <p className="text-white font-semibold">Date & Time</p>
                                <p className="text-gray-400 text-sm">Track when you traded</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <FileText className="h-5 w-5 text-green-500 mb-2" />
                                <p className="text-white font-semibold">Full Details</p>
                                <p className="text-gray-400 text-sm">Price, quantity, total</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-special/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-special/20 to-transparent z-10" />
                            <Image 
                                src="/imgs/history.png"
                                alt="Transaction history showing buy and sell records with timestamps"
                                width={600}
                                height={450}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}