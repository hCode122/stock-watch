import nodeCron from "node-cron";
import {
    updateCalculations, updateCoinMarketOverview, 
    updateMatketOverview, updateTopChanges, updateTopChangesCoins
} from "../services/dataRefreshService"

nodeCron.schedule('05 21 * * *', async () => {
    console.log('Daily scheduled database update started:')
    await updateTopChanges();
    await updateMatketOverview();
    await updateCalculations();
    await updateCoinMarketOverview();
    await updateTopChangesCoins();

})