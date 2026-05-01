'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAuthState, selectToken } from "@/state/slices/authSlice"
import { NavBar } from "../components/NavBar/navBar"
import { useGetUserPortfolio } from "@/hooks/useGetUserPortfolio"
import { useGetUserNetworth } from "@/hooks/useGetUserNetworth"
import { NetWorthCard } from "../components/StatCards/NetWorthCard"
import PortfolioCard from "../components/StatCards/PortfolioCard"
import ExtraStats from "../components/StatCards/ExtraStats"
import { useGetTransactions } from "@/hooks/useGetTransactions"
import { RecentTransactionsCard } from "../components/StatCards/LatestTransactions"
import { Spinner } from "@/components/ui/spinner"

const Dashboard = () => {
    const router = useRouter()
    const isAuthorized = useSelector(selectAuthState);
    const token = useSelector(selectToken);

    const { portfolio, loadingPortfolio, errorPortfolio, refreshPort } = useGetUserPortfolio();
    const { networth, loadingNetworth, errorNetworth, refreshNW } = useGetUserNetworth();
    const { transactions, loading: loadingTransactions, error: errorTransactions, refreshTransaction } = useGetTransactions();
   
    const refreshAll = () => {
        refreshPort();
        refreshNW();
        refreshTransaction();
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthorized && !token) {
                router.push('/sign-in');
            }
        }, 100);
        
        return () => clearTimeout(timer);
    }, [isAuthorized, token, router]);
    console.log(networth)
    const isLoading = (!isAuthorized && !token) || loadingPortfolio || loadingNetworth || loadingTransactions;
    if (!isAuthorized && !token) {
        return (
            <div className="h-full max-w-full flex-col mx-8 gap-12 pb-16">
                <NavBar />
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                    <Spinner className="size-10" />
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (isLoading && !portfolio && !networth) {
        return (
            <div className="h-full max-w-full flex-col mx-8 gap-12 pb-16">
                <NavBar />
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                    <Spinner className="size-10" />
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full max-w-full flex-col mx-8 gap-12 pb-16">
            <NavBar />
            
            {networth && networth.length > 0 && (
                <NetWorthCard 
                    data={networth}  
                    loading={loadingNetworth} 
                    error={errorNetworth}
                />
)}
            
            {networth && portfolio && networth.length > 0 && (
                <ExtraStats 
                    portfolio={portfolio} 
                    networth={networth[networth.length - 1]}
                    loading={loadingNetworth} 
                />
            )}
            
            <h2 className="text-[1.2rem] lg:text-[1.6rem] font-bold mt-12 mb-4">Holdings</h2>
            {portfolio ? (
                <PortfolioCard 
                    data={portfolio} 
                    loading={loadingPortfolio} 
                    error={errorPortfolio}
                    onSuccess={refreshAll}
                />
            ) : loadingPortfolio ? (
                <div className="animate-pulse bg-gray-800/50 rounded-lg h-96" />
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    No holdings yet. Start trading to see your portfolio!
                </div>
            )}
            
            <h2 className="text-[1.2rem] lg:text-[1.6rem] font-bold mt-12 mb-4">Latest Transactions</h2>
            {transactions && transactions.length > 0 ? (
                <RecentTransactionsCard 
                    data={transactions} 
                    error={errorTransactions} 
                    loading={loadingTransactions} 
                />
            ) : loadingTransactions ? (
                <div className="animate-pulse bg-gray-800/50 rounded-lg h-64" />
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    No transactions yet. Buy or sell assets to see your history!
                </div>
            )}
        </div>
    )
}

export default Dashboard