// components/home/MarketFeature.tsx
import Image from "next/image"
import { TrendingUp, Search, Activity, ShoppingCart, BarChart3, Zap } from "lucide-react"

export const MarketFeature = () => {
    return (
        <section className="py-14 px-4 md:px-8 bg-black">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-special/10 px-4 py-2 rounded-full mb-4">
                        <Activity className="h-4 w-4 text-special" />
                        <span className="text-special text-sm font-medium">Live Market Data</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        Real-Time{" "}
                        <span className="text-special">Stock & Crypto</span>
                        {" "}Prices
                    </h2>
                    <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
                        Browse hundreds of assets with live pricing, 24h changes, and detailed market data
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
                    <div className="flex-1 space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            Browse &{" "}
                            <span className="text-special">Search</span>
                            {" "}Any Asset
                        </h3>
                        <p className="text-gray-400 text-lg">
                            Search through thousands of stocks and cryptocurrencies. View detailed information 
                            including price, volume, market cap, and 24h price changes.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Search className="h-5 w-5 text-special" />
                                <span>Instant search</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <BarChart3 className="h-5 w-5 text-special" />
                                <span>Detailed metrics</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-special/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-special/20 to-transparent z-10" />
                            <Image 
                                src="/imgs/market-1.png"
                                alt="Market page showing stock and crypto listings with prices"
                                width={550}
                                height={400}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            Buy & Sell With{" "}
                            <span className="text-special">One Click</span>
                        </h3>
                        <p className="text-gray-400 text-lg">
                            Execute trades instantly with our intuitive buy/sell interface. 
                            Enter quantity, see estimated cost, and confirm your trade in seconds.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <ShoppingCart className="h-5 w-5 text-green-500" />
                                <span>Instant execution</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Zap className="h-5 w-5 text-yellow-500" />
                                <span>Real-time confirmation</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-special/20">
                            <div className="absolute inset-0 bg-gradient-to-bl from-special/20 to-transparent z-10" />
                            <Image 
                                src="/imgs/market-2.png"
                                alt="Buy and sell interface for trading stocks and crypto"
                                width={550}
                                height={400}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}