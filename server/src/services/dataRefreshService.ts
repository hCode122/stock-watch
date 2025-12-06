import { top_changed_response } from "@/types/marketTypes";
import { alphaVintageInstance } from "../axios/alphaVintageInstance";
import nodeCron from "node-cron";
import { pool } from "../config/database";

const updateTopChanges = async () => {
    try {
        const response = await alphaVintageInstance.get('/query?function=TOP_GAINERS_LOSERS')
        const {last_updated, top_gainers, top_losers, most_active} : top_changed_response = response.data 

        pool.connect()

        for (const stock of top_gainers) {
            await pool.query(`INSERT INTO top_gainers 
            (ticker, price, change_amount, change_percentage, volume, last_updated) VALUES
            ($1, $2, $3, $4, $5, $6)`, [stock.ticker, stock.price, stock.change_amount, stock.change_percentage.slice(0, -2), stock.volume, last_updated])
        }

        console.log("Updated the database succesfully at", Date.toLocaleString())
    } catch (error) {
        throw error;
    }
    
    
}

export default updateTopChanges