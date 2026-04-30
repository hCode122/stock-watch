import { useState } from 'react';
import axios from '@/axiosInstance';
import { useSelector } from 'react-redux';
import { selectToken } from '@/state/slices/authSlice';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface SellParams {
    assetType: 'STOCK' | 'CRYPTO';
    symbol: string;
    quantity: number;
    price: number;
}

export const useSell = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const token = useSelector(selectToken);

    const sell = async (params: SellParams) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${API_BASE}/api/dashboard/sell`, {
                assetType: params.assetType,
                symbol: params.symbol,
                quantity: params.quantity,
                price: params.price
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setData(response.data);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to complete sale';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { sell, isLoading, error, data };
};