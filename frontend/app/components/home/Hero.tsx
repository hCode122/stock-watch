'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import NavLink from "../NavBar/navLink"
import { Shield, ArrowRight, CoinsIcon, Menu, X } from "lucide-react"
import Link from "next/link"
import { useGetStockCalcData } from "@/hooks/useGetStockCalcData"

export const Hero = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    
    const navLinkList = [
        { text: "Dashboard", target: "/dashboard", light: true },
        { text: "Market", target: "/market", light: true }
        ]

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width * 100,
            y: (e.clientY - rect.top) / rect.height * 100
        })
    }
    const {calcData, calcLoading, calcError} = useGetStockCalcData()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <div 
            className="relative flex flex-col bg-black bg-gradient-to-b from-gray-950 to-black overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div 
                className="pointer-events-none absolute inset-0 transition-all duration-300"
                style={{
                    opacity: isHovering ? 0.5 : 0,
                    background: `radial-gradient(circle 700px at ${mousePosition.x}% ${mousePosition.y}%, 
                        rgba(255,255,255,0.1),
                        rgba(200,200,210,0.1) 40%,
                        transparent 70%)`,
                    filter: 'blur(30px)'
                }}
            />

            <div className="relative z-10 px-3 sm:px-6 md:px-8 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <Link href={'/'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <CoinsIcon className="h-8 w-8 sm:h-10 sm:w-10 text-special" />
                        <span className="text-white font-bold text-base sm:text-xl hidden xs:block">StockWatch</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4 lg:gap-16">
                        {navLinkList.map((link, index) => (
                            <NavLink key={index} navProbs={link} />
                        ))}
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-950 to-black shadow-xl border-l border-gray-800">
                        <div className="flex flex-col p-6 pt-20 space-y-4">
                            {navLinkList.map((link, index) => (
                                <Link 
                                    key={index}
                                    href={link.target}
                                    className="text-white hover:text-special transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 px-3 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-special/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-special text-xs sm:text-sm mx-auto lg:mx-0 mb-4 sm:mb-6">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-[10px] sm:text-sm">Start with $10,000 virtual money!</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        Your wealth,
                        <br />
                        <span className="text-special">Uncomplicated.</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mt-3 sm:mt-4 md:mt-6 max-w-2xl mx-auto lg:mx-0">
                        Finally understand your investments with our clean, intuitive portfolio tracker.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 justify-center lg:justify-start">
                        <Button  className="bg-special hover:bg-special/80 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 group">
                            <Link className="flex items-center " href={'/sign-up'}>Create an account
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="border-gray-600 bg-secondary text-primary hover:text-secondary hover:bg-primary px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg rounded-full transition-all duration-300">
                            <Link href={'/market'}> View Demo </Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8">
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-white">10K+</p>
                            <p className="text-xs sm:text-sm text-gray-400">Active Traders</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-white">$1M+</p>
                            <p className="text-xs sm:text-sm text-gray-400">Virtual Volume</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-white">24/7</p>
                            <p className="text-xs sm:text-sm text-gray-400">Market Data</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[500px] mt-6 lg:mt-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 lg:hidden rounded-2xl" />
                    <Image 
                        fill
                        className="rounded-2xl object-contain" 
                        alt="Trading platform dashboard preview" 
                        src={'/imgs/hero-dsk.png'} 
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>

            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
    )
}