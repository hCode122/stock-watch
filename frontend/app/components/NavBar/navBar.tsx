'use client'

import { CoinsIcon, Menu, X, Sun, Moon, LogOut } from "lucide-react"
import NavLink from "./navLink"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { logout, selectAuthState } from "@/state/slices/authSlice"

export const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const isAuthorized = useSelector(selectAuthState)

    const navLinkList = [
        { text: "Dashboard", target: "/dashboard", light: false },
        { text: "Market", target: "/market", light: false }
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
            <nav className="w-full bg-card rounded-xl mb-4 mt-2 shadow-sm border border-border/50">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                        <div className="p-1.5 rounded-lg bg-special/10 group-hover:bg-special/20 transition-colors">
                            <CoinsIcon className="h-6 w-6 sm:h-7 sm:w-7 text-special" />
                        </div>
                        <span className="text-foreground font-bold text-lg sm:text-xl hidden xs:block">
                            StockWatch
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 lg:gap-12">
                        {navLinkList.map((link, index) => (
                            <NavLink key={index} navProbs={link} />
                        ))}
                        <div className="w-[2px] h-8 bg-special" />
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5 text-foreground" />
                            ) : (
                                <Moon className="h-5 w-5 text-foreground" />
                            )}
                        </button>
                        {isAuthorized && (
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                aria-label="Sign out"
                            >
                                <LogOut className="h-5 w-5 text-red-500" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
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
                <div className="fixed inset-0 z-40 md:hidden">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-card shadow-xl rounded-l-xl border-l border-border">
                        <div className="flex flex-col p-6 pt-20 space-y-2">
                            {navLinkList.map((link, index) => (
                                <div key={index} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Link 
                                        href={link.target}
                                        className="block text-foreground hover:text-special hover:bg-muted/50 transition-colors py-3 px-4 rounded-lg"
                                    >
                                        {link.text}
                                    </Link>
                                </div>
                            ))}
                            <div className="pt-4 mt-4 border-t border-border">
                                <button
                                    onClick={() => {
                                        toggleDarkMode()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="w-full text-left text-foreground hover:text-special hover:bg-muted/50 transition-colors py-3 px-4 rounded-lg flex items-center gap-3"
                                >
                                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                {isAuthorized && (
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full text-left text-red-500 hover:bg-red-500/10 transition-colors py-3 px-4 rounded-lg flex items-center gap-3"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}