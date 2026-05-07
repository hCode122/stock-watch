import { envConfig } from "../config/environment";
import axios from "axios";

export const coinGeckoInstance = axios.create({
    baseURL: "https://api.coingecko.com/api/",
    timeout: 40000,
    headers: {
        'x-cg-demo-api-key': envConfig.apis.coinGecko,
        'Accept': "application/json",
    }
})