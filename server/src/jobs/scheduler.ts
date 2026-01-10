import nodeCron from "node-cron";
import {
    updateCalculations, updateCoinMarketOverview, 
    updateMarketOverview, updateTopChanges, updateTopChangesCoins
} from "../services/dataRefreshService"

nodeCron.schedule('26 11 * * *', async () => {
    await updateTopChanges();
});

nodeCron.schedule('27 11 * * *', async () => { 
    await updateMarketOverview();
});

nodeCron.schedule('28 11 * * *', async () => { 
    await updateCalculations();
});

nodeCron.schedule('29 11 * * *', async () => { 
    await updateCoinMarketOverview();
});

nodeCron.schedule('30 11 * * *', async () => { 
    await updateTopChangesCoins();
});