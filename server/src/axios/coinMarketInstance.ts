import axios from "axios";
import { envConfig } from "../config/environment";


export const coinMarketInstance = axios.create({
    baseURL: "https://pro-api.coinmarketcap.com/",
    timeout: 30000,
    headers: {
        "X-CMC_PRO_API_KEY": envConfig.apis.coinMarket,
        'Accept': "application/json",
        "Accept-Encoding": "deflate, gzip"
    }
})