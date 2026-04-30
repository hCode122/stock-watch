'use client'
import { Button } from "@/components/ui/button"
import { ArrowUp, Rocket, Sparkles, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export const CTASection = () => {
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <section className="relative py-24 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950 to-black" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-special/10 rounded-full blur-[100px]" />
                
                <div className="relative z-10 container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-special/10 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="h-4 w-4 text-special" />
                        <span className="text-special text-sm font-medium">Start Your Journey</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
                        Ready to Take Control of{" "}
                        <span className="text-special">Your Finances?</span>
                    </h2>
                    
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        Join thousands of traders who are learning to invest with virtual money. 
                        Start with $10,000 risk-free and build your portfolio today.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/sign-up">
                            <Button className="bg-special hover:bg-special/80 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 group">
                                <Rocket className="mr-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
                                Create Free Account
                            </Button>
                        </Link>
                        <Link href="/market">
                            <Button variant="outline" className="border-gray-600 text-black hover:text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                                <TrendingUp className="mr-2 h-5 w-5" />
                                Explore Market
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-8 text-center">
                        <div>
                            <p className="text-2xl font-bold text-white">$10K</p>
                            <p className="text-sm text-gray-500">Virtual Starting Balance</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">500+</p>
                            <p className="text-sm text-gray-500">Tradable Assets</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">24/7</p>
                            <p className="text-sm text-gray-500">Market Data</p>
                        </div>
                    </div>
                </div>
            </section>

            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-special hover:bg-special/80 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                    aria-label="Back to top"
                >
                    <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                </button>
            )}
        </>
    )
}