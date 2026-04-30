import { useState, useEffect, useCallback } from "react";
import axios from "@/axiosInstance";
const API_BASE = process.env.NEXT_PUBLIC_API_URL

interface Transaction {
    transaction_id: number;
    type: 'BUY' | 'SELL';
    asset_type: 'STOCK' | 'CRYPTO';
    symbol_name: string;
    quantity: number;
    price_per_share: number;
    total_amount: number;
    transaction_date: string;
}

interface UseTransactionsOptions {
    limit?: number;
    type?: 'BUY' | 'SELL';
    assetType?: 'STOCK' | 'CRYPTO';
}

interface PaginationInfo {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
}


export const useGetTransactions = (options: UseTransactionsOptions = {}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        limit: options.limit || 10,
        offset: 0,
        total: 0,
        hasMore: false
    });

    const fetchTransactions = async (offset: number = 0) => {
        try {
            setLoading(true);
            const params: any = {
                limit: options.limit || 10,
                offset
            };
            if (options.type) params.type = options.type;
            if (options.assetType) params.assetType = options.assetType;
            
            const response = await axios.get(`${API_BASE}/api/dashboard/transactions`, { params });
            setTransactions(response.data.data);
            setPagination({
                ...pagination,
                offset,
                total: response.data.pagination.total,
                hasMore: response.data.pagination.hasMore
            });
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch transactions');
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && pagination.hasMore) {
            fetchTransactions(pagination.offset + pagination.limit);
        }
    };

    const refresh = () => {
        fetchTransactions(0);
    };

    useEffect(() => {
        fetchTransactions(0);
    }, []); 

    return { transactions, loading, error, pagination, loadMore, refreshTransaction: fetchTransactions };
};