import Image from "next/image"
import { Wallet, TrendingUp, TrendingDown, PieChart } from "lucide-react"

export const HoldingsFeature = () => {
    return (
        <section className="py-14 px-4 md:px-8 bg-black">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-special/10 px-4 py-2 rounded-full">
                            <Wallet className="h-4 w-4 text-special" />
                            <span className="text-special text-sm font-medium">Portfolio Management</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            All Your{" "}
                            <span className="text-special">Holdings</span>
                            {" "}In One Table
                        </h2>
                        
                        <p className="text-gray-400 text-lg leading-relaxed">
                            See every stock and cryptocurrency you own with real-time prices. 
                            Track your average buy price, current value, and profit/loss for each position.
                        </p>
                        
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <span>Real-time price updates</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <PieChart className="h-5 w-5 text-special" />
                                <span>Profit/Loss calculations</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <TrendingDown className="h-5 w-5 text-orange-500" />
                                <span>Daily change percentages</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-special/20">
                            <div className="absolute inset-0 bg-gradient-to-bl from-special/20 to-transparent z-10" />
                            <Image 
                                src="/imgs/holdings.png"
                                alt="Holdings table showing stocks and crypto with prices and profit/loss"
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