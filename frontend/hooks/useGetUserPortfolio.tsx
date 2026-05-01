import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectId } from "@/state/slices/authSlice";
import axios from "@/axiosInstance"
import { Portfolio, PortfolioResponse } from "@/types/userTypes";

const API_BASE = process.env.NEXT_PUBLIC_API_URL


export const useGetUserPortfolio = () => {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loadingPortfolio, setLoadingPortfolio] = useState(true);
    const [errorPortfolio, setErrorPortfolio] = useState<string | null>(null);

     const fetchPortfolio = async () => {
            try {
                setLoadingPortfolio(true);
                const response = await axios.get<PortfolioResponse>(`${API_BASE}/api/dashboard/portfolio`);
                setPortfolio(response.data.data);
            } catch (err) {
                setErrorPortfolio("Couldn't fetch portfolio");
            } finally {
                setLoadingPortfolio(false);
            }
        };

    useEffect(() => {
       
        
        fetchPortfolio();
    }, []);

    return { portfolio, loadingPortfolio, errorPortfolio, refreshPort: fetchPortfolio };
};