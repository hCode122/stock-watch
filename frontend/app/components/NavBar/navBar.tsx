'use client'

import { CoinsIcon, Menu, X, Sun, Moon, LogOut, TrendingUp, LayoutDashboard, User } from "lucide-react"
import NavLink from "./navLink"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { logout, selectAuthState } from "@/state/slices/authSlice"
import { Button } from "@/components/ui/button"

export const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const isAuthorized = useSelector(selectAuthState)

    const navLinkList = [
        { text: "Dashboard", target: "/dashboard", light: false, icon: LayoutDashboard },
        { text: "Market", target: "/market", light: false, icon: TrendingUp }
    ]

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const isDark = savedTheme === 'dark'
        setIsDarkMode(isDark)
        if (isDark) {
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        if (!isDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        router.push('/')
    }

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
        <>
            <nav className="w-full bg-card/80 backdrop-blur-md rounded-2xl mb-4 mt-2 shadow-lg border border-special/20">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all group">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-special/20 to-special/5 group-hover:from-special/30 group-hover:to-special/10 transition-all">
                            <CoinsIcon className="h-6 w-6 sm:h-7 sm:w-7 text-special" />
                        </div>
                        <span className="text-foreground font-bold text-lg sm:text-xl bg-gradient-to-r from-foreground to-special bg-clip-text text-transparent hidden xs:block">
                            StockWatch
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 lg:gap-12">
                        {navLinkList.map((link, index) => (
                            <NavLink key={index} navProbs={link} />
                        ))}
                        <div className="w-px h-6 bg-special/30" />
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl hover:bg-muted/50 transition-all"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5 text-foreground" />
                            ) : (
                                <Moon className="h-5 w-5 text-foreground" />
                            )}
                        </button>
                        {isAuthorized ? (
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-xl hover:bg-red-500/10 transition-all group"
                                aria-label="Sign out"
                            >
                                <LogOut className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <Link href="/sign-in">
                                <Button variant="ghost" className="text-foreground hover:text-special rounded-xl">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center p-2 rounded-xl hover:bg-muted/50 transition-all"
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5 text-foreground" />
                        ) : (
                            <Menu className="h-5 w-5 text-foreground" />
                        )}
                    </button>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-card/95 backdrop-blur-md shadow-2xl rounded-l-2xl border-l border-special/20 animate-slide-in-right">
                        <div className="p-6 border-b border-special/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-special/20 to-special/5">
                                    <CoinsIcon className="h-8 w-8 text-special" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-foreground">StockWatch</p>
                                    <p className="text-xs text-muted-foreground">Trade smarter</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 py-4">
                            {navLinkList.map((link, index) => {
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={index}
                                        href={link.target}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 px-6 py-4 text-foreground hover:bg-special/10 transition-all group"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-300  group-hover:bg-special/20 transition-all">
                                            <Icon className="h-5 w-5 text-special" />
                                        </div>
                                        <span className="font-medium">{link.text}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-special/20 bg-gradient-to-t from-card to-transparent">
                            <button
                                onClick={() => {
                                    toggleDarkMode()
                                    setIsMobileMenuOpen(false)
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted/50 transition-all mb-2"
                            >
                                {isDarkMode ? (
                                    <Sun className="h-5 w-5 text-foreground" />
                                ) : (
                                    <Moon className="h-5 w-5 text-foreground" />
                                )}
                                <span className="text-foreground">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                            
                            {isAuthorized ? (
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all group"
                                >
                                    <LogOut className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-red-500">Sign Out</span>
                                </button>
                            ) : (
                                <Link
                                    href="/sign-in"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-special/10 transition-all"
                                >
                                    <User className="h-5 w-5 text-special" />
                                    <span className="text-foreground">Sign In</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}