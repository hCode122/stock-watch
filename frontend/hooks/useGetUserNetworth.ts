import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectId } from "@/state/slices/authSlice";
import axios from "@/axiosInstance"
import { NetWorthData ,NetWorthResponse } from "@/types/userTypes";


const API_BASE = process.env.NEXT_PUBLIC_API_URL


export const useGetUserNetworth = () => {
    const [loadingNetworth, setIsLoading] = useState(false);
    const [errorNetworth, setError] = useState<string | null>(null);
    const [networth, setData] = useState<NetWorthResponse | null>(null);
    
     const getNetworthHistory = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get<NetWorthData[]>(`${API_BASE}/api/dashboard/networth`)
                
                setData({data:response.data})
                setIsLoading(false)
                
                
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'Purchase failed';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        } 

    useEffect(() => {
        getNetworthHistory()
    }, [])
    

    return {networth, loadingNetworth, errorNetworth, refreshNW: getNetworthHistory}
}