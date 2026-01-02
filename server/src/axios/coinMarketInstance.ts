import axios from "axios";
import { envConfig } from "@/config/environment";


export const coinMarketInstance = axios.create({
    baseURL: "pro-api.coinmarketcap.com/v1/cryptocurrency/",
    timeout: 30000,
    headers: {
        "X-CMC_PRO_API_KEY": envConfig.apis.coinMarket
    }
})