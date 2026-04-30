import { useState } from 'react';
import axios from '@/axiosInstance'
import { useSelector } from 'react-redux';
import { selectId } from '@/state/slices/authSlice';

const API_BASE = process.env.NEXT_PUBLIC_API_URL

interface HookParams {
    transactionType: string;
    assetType: string,
    name: string;
    amount: number;
    currPrice: number;
}

export const usePurchase = () => { 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    
    const userId = useSelector(selectId); 

    const purchase = async ({ transactionType, assetType, name, amount, currPrice }: HookParams) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${API_BASE}/api/market/trade`, {
                transactionType,
                assetType,
                symbol: name,
                quantity:amount,
                price:currPrice,
                userId,
            });
            
            setData(response.data);
            return response.data;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Purchase failed';
            setError(errorMessage);
            throw new Error(errorMessage);
            
        } finally {
            setIsLoading(false);
        }
    };

    return {
        purchase,   
        isLoading, 
        error,       
        data         
    };
};