import nodeCron from "node-cron";
import {
    updateCalculations, updateCoinMarketOverview, 
    updateMarketOverview, updateStockPricesTable, updateTopChanges, updateTopChangesCoins
} from "../services/dataRefreshService"
import { captureDailyNetWorth } from "../services/transactionService";

nodeCron.schedule('56 14 * * *', async () => {
    await updateTopChanges();
});

nodeCron.schedule('56 14 * * *', async () => { 
    await updateMarketOverview();
});

nodeCron.schedule('57 14 * * *', async () => { 
    await updateCalculations();
});

nodeCron.schedule('55 15 * * *', async () => { 
    await updateCoinMarketOverview();
});

nodeCron.schedule('51 15 * * *', async () => { 
    await updateTopChangesCoins();
});

nodeCron.schedule('05 15 * * *', async () => {
    await updateStockPricesTable()
})

nodeCron.schedule('43 19 * * *', async () => {
    await captureDailyNetWorth()
})