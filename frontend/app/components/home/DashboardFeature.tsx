import Image from "next/image"
import { TrendingUp, TrendingDown, DollarSign, LineChart } from "lucide-react"

export const DashboardFeature = () => {
    return (
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-gray-950">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-special/10 px-4 py-2 rounded-full">
                            <LineChart className="h-4 w-4 text-special" />
                            <span className="text-special text-sm font-medium">Real-time Dashboard</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Track Your{" "}
                            <span className="text-special">Net Worth</span>
                            {" "}At a Glance
                        </h2>
                        
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Your dashboard shows your cash balance, portfolio value, and net worth in one place. 
                            Watch your wealth grow with interactive charts that track your performance over time.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <DollarSign className="h-5 w-5 text-green-500 mb-2" />
                                <p className="text-white font-semibold">Cash Balance</p>
                                <p className="text-gray-400 text-sm">Available funds to trade</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <TrendingUp className="h-5 w-5 text-special mb-2" />
                                <p className="text-white font-semibold">Net Worth</p>
                                <p className="text-gray-400 text-sm">Cash + Investments</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-special/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-special/20 to-transparent z-10" />
                            <Image 
                                src="/imgs/dashboard.png"
                                alt="Dashboard overview showing net worth chart and portfolio statistics"
                                width={600}
                                height={450}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}