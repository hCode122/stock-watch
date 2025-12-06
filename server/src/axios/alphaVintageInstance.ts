import axios from "axios";
import { envConfig } from "../config/environment";

export const alphaVintageInstance = axios.create({
    baseURL: 'https://www.alphavantage.co/',
    timeout: 20000,
    params: {
        apikey: envConfig.apis.alphaVantage
    }
})


