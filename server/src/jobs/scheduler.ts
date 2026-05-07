import nodeCron from "node-cron";
import {
    updateCalculations,
    updateCoinMarketOverview,
    updateMarketOverview,
    updateStockPricesTable,
    updateTopChanges,
    updateTopChangesCoins
} from "../services/dataRefreshService";
import { captureDailyNetWorth } from "../services/transactionService";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



const runAllJobs = async () => {
    console.log('Alpha Vantage key exists?', !!process.env.ALPHA_VANTAGE_API_KEY);
console.log('CoinMarket key exists?', !!process.env.COIN_MARKET);
console.log('Alpha Vantage key length:', process.env.ALPHA_VANTAGE_API_KEY?.length);
    console.log('Starting daily data refresh...');
    const startTime = Date.now();
    
    try {
        await updateTopChanges();
        console.log('Top changes completed');
        await delay(30000); 
        
        await updateMarketOverview();
        console.log('Market overview completed');
        await delay(30000);
        
        await updateCalculations();
        console.log('Calculations completed');
        await delay(30000);
        
        await updateCoinMarketOverview();
        console.log('Coin market overview completed');
        await delay(30000);
        
        await updateTopChangesCoins();
        console.log('Top changes coins completed');
        await delay(30000);
        
        await updateStockPricesTable();
        console.log('Stock prices table completed');
        await delay(60000);
        
        await captureDailyNetWorth();
        console.log('Net worth capture completed');
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`All jobs completed in ${duration} seconds`);
        
    } catch (error) {
        console.error('Job failed:', error);
    }
};

nodeCron.schedule('0 20 * * *', runAllJobs);

if (process.env.NODE_ENV !== 'production') {
    
}

export { runAllJobs };