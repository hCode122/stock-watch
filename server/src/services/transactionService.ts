import { pool } from "../config/database";

interface PurchaseParams {
    transactionType: 'BUY' | 'SELL';
    assetType: 'STOCK' | 'CRYPTO';
    symbol: string;
    quantity: number;
    price: number;
    userId: string;
}

export const Purchase = async (params: PurchaseParams) => {
    const { transactionType, assetType, symbol, quantity, price, userId } = params;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const totalAmount = quantity * price;
        
        if (transactionType === 'BUY') {
            const balanceCheck = await client.query(
                'SELECT balance FROM users WHERE id = $1',
                [userId]
            );
            
            if (balanceCheck.rows.length === 0) {
                throw new Error('User not found');
            }
            
            const currentBalance = parseFloat(balanceCheck.rows[0].balance);
            if (currentBalance < totalAmount) {
                throw new Error('Insufficient balance');
            }
            
            await client.query(
                'UPDATE users SET balance = balance - $1 WHERE id = $2',
                [totalAmount, userId]
            );
        } else if (transactionType === 'SELL') {
            if (assetType === 'STOCK') {
                const holdingCheck = await client.query(
                    'SELECT quantity FROM holdings WHERE user_id = $1 AND stock_symbol = $2',
                    [userId, symbol]
                );
                
                if (holdingCheck.rows.length === 0 || 
                    parseFloat(holdingCheck.rows[0].quantity) < quantity) {
                    throw new Error('Insufficient holdings to sell');
                }
            } else {
                const cryptoCheck = await client.query(
                    'SELECT quantity FROM crypto_holdings WHERE user_id = $1 AND crypto_symbol = $2',
                    [userId, symbol]
                );
                
                if (cryptoCheck.rows.length === 0 || 
                    parseFloat(cryptoCheck.rows[0].quantity) < quantity) {
                    throw new Error('Insufficient crypto holdings to sell');
                }
            }
            
            await client.query(
                'UPDATE users SET balance = balance + $1 WHERE id = $2',
                [totalAmount, userId]
            );
        }
        
        const transactionQuery = `
            INSERT INTO transactions (
                user_id, 
                type, 
                symbol_name, 
                quantity, 
                price_per_share, 
                total_amount,
                asset_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING transaction_id
        `;
        
        const transactionValues = [
            userId,
            transactionType,
            symbol,
            quantity,
            price,
            totalAmount,
            assetType
        ];
        
        const transactionResult = await client.query(transactionQuery, transactionValues);
        
        if (assetType === 'STOCK') {
            await updateStockHoldings(client, userId, symbol, quantity, price, transactionType);
        } else {
            await updateCryptoHoldings(client, userId, symbol, quantity, price, transactionType);
        }
        
        await client.query('COMMIT');
        
        return {
            success: true,
            message: `${transactionType} completed successfully`,
            data: {
                transaction_id: transactionResult.rows[0].transaction_id,
                assetType,
                symbol,
                transactionType,
                quantity,
                price,
                total: totalAmount
            }
        };
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Purchase error:', error);
        
        throw {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to process transaction',
            error
        };
        
    } finally {
        client.release();
    }
};

async function updateStockHoldings(client: any, userId: string, symbol: string, 
                                   quantity: number, price: number, type: 'BUY' | 'SELL') {
    if (type === 'BUY') {
        const holdingCheck = await client.query(
            'SELECT * FROM holdings WHERE user_id = $1 AND stock_symbol = $2',
            [userId, symbol]
        );
        
        if (holdingCheck.rows.length > 0) {
            const existing = holdingCheck.rows[0];
            const existingQty = parseFloat(existing.quantity);
            const existingAvg = parseFloat(existing.avg_purchase_price);
            
            const totalValue = (existingQty * existingAvg) + (quantity * price);
            const newQuantity = existingQty + quantity;
            const newAvgPrice = totalValue / newQuantity;
            
            await client.query(
                `UPDATE holdings 
                 SET quantity = $1, avg_purchase_price = $2, last_updated = CURRENT_TIMESTAMP
                 WHERE user_id = $3 AND stock_symbol = $4`,
                [newQuantity, newAvgPrice, userId, symbol]
            );
        } else {
            await client.query(
                `INSERT INTO holdings (user_id, stock_symbol, quantity, avg_purchase_price)
                 VALUES ($1, $2, $3, $4)`,
                [userId, symbol, quantity, price]
            );
        }
    } else { 
        const holdingCheck = await client.query(
            'SELECT * FROM holdings WHERE user_id = $1 AND stock_symbol = $2',
            [userId, symbol]
        );
        
        if (holdingCheck.rows.length > 0) {
            const existing = holdingCheck.rows[0];
            const existingQty = parseFloat(existing.quantity);
            
            if (existingQty === quantity) {
                await client.query(
                    'DELETE FROM holdings WHERE user_id = $1 AND stock_symbol = $2',
                    [userId, symbol]
                );
            } else {
                await client.query(
                    `UPDATE holdings 
                     SET quantity = $1, last_updated = CURRENT_TIMESTAMP
                     WHERE user_id = $2 AND stock_symbol = $3`,
                    [existingQty - quantity, userId, symbol]
                );
            }
        }
    }
}

async function updateCryptoHoldings(client: any, userId: string, symbol: string,
                                    quantity: number, price: number, type: 'BUY' | 'SELL') {
    await client.query(`
        CREATE TABLE IF NOT EXISTS crypto_holdings (
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            crypto_symbol VARCHAR(25) NOT NULL,
            quantity DECIMAL NOT NULL,
            avg_purchase_price DECIMAL NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, crypto_symbol)
        )
    `);
    
    if (type === 'BUY') {
        const holdingCheck = await client.query(
            'SELECT * FROM crypto_holdings WHERE user_id = $1 AND crypto_symbol = $2',
            [userId, symbol]
        );
        
        if (holdingCheck.rows.length > 0) {
            const existing = holdingCheck.rows[0];
            const existingQty = parseFloat(existing.quantity);
            const existingAvg = parseFloat(existing.avg_purchase_price);
            
            const totalValue = (existingQty * existingAvg) + (quantity * price);
            const newQuantity = existingQty + quantity;
            const newAvgPrice = totalValue / newQuantity;
            
            await client.query(
                `UPDATE crypto_holdings 
                 SET quantity = $1, avg_purchase_price = $2, last_updated = CURRENT_TIMESTAMP
                 WHERE user_id = $3 AND crypto_symbol = $4`,
                [newQuantity, newAvgPrice, userId, symbol]
            );
        } else {
            await client.query(
                `INSERT INTO crypto_holdings (user_id, crypto_symbol, quantity, avg_purchase_price)
                 VALUES ($1, $2, $3, $4)`,
                [userId, symbol, quantity, price]
            );
        }
    } else { 
        const holdingCheck = await client.query(
            'SELECT * FROM crypto_holdings WHERE user_id = $1 AND crypto_symbol = $2',
            [userId, symbol]
        );
        
        if (holdingCheck.rows.length > 0) {
            const existing = holdingCheck.rows[0];
            const existingQty = parseFloat(existing.quantity);
            
            if (existingQty === quantity) {
                await client.query(
                    'DELETE FROM crypto_holdings WHERE user_id = $1 AND crypto_symbol = $2',
                    [userId, symbol]
                );
            } else {
                await client.query(
                    `UPDATE crypto_holdings 
                     SET quantity = $1, last_updated = CURRENT_TIMESTAMP
                     WHERE user_id = $2 AND crypto_symbol = $3`,
                    [existingQty - quantity, userId, symbol]
                );
            }
        }
    }
}

export async function captureDailyNetWorth() {
    const users = await pool.query('SELECT id, balance FROM users');
    
    for (const user of users.rows) {
        const portfolio = await getUserPortfolio(user.id);
        const portfolioValue = portfolio.totalValue;
        
        await pool.query(`
            INSERT INTO net_worth_history (user_id, snapshot_date, balance, portfolio_value, net_worth)
            VALUES ($1, CURRENT_DATE, $2, $3, $4)
            ON CONFLICT (user_id, snapshot_date) DO UPDATE SET
                balance = EXCLUDED.balance,
                portfolio_value = EXCLUDED.portfolio_value,
                net_worth = EXCLUDED.net_worth
        `, [user.id, Number(user.balance), portfolioValue, Number(user.balance) + Number(portfolioValue)]);
    }
}


interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    currentValue: number;
    type: 'STOCK' | 'CRYPTO';
}

interface Portfolio {
    totalValue: number;
    holdings: Holding[];
}

export async function getUserPortfolio(userId: string): Promise<Portfolio> {
    try {
        const stockQuery = `
            SELECT 
                h.stock_symbol as symbol,
                h.quantity,
                h.avg_purchase_price as avg_price,
                COALESCE(
                    (SELECT current_price 
                     FROM stock_prices 
                     WHERE symbol = h.stock_symbol 
                     ORDER BY date DESC, last_updated DESC 
                     LIMIT 1), 
                    0
                ) as current_price,
                'STOCK' as type
            FROM holdings h
            WHERE h.user_id = $1 AND h.quantity > 0
        `;
        
        const stockHoldings = await pool.query(stockQuery, [userId]);
        
        const cryptoQuery = `
            SELECT 
                ch.crypto_symbol as symbol,
                ch.quantity,
                ch.avg_purchase_price as avg_price,
                COALESCE(
                    (SELECT cp.price 
                     FROM coin_price cp
                     JOIN coins c ON cp.coin_id = c.coin_id
                     WHERE c.coin_symbol = ch.crypto_symbol
                     ORDER BY cp.date DESC, cp.recorded_at DESC 
                     LIMIT 1), 
                    0
                ) as current_price,
                'CRYPTO' as type
            FROM crypto_holdings ch
            WHERE ch.user_id = $1 AND ch.quantity > 0
        `;
        
        const cryptoHoldings = await pool.query(cryptoQuery, [userId]);
        
        let totalValue = 0;
        const holdings: Holding[] = [];

        for (const row of stockHoldings.rows) {
            const quantity = parseFloat(row.quantity);
            const currentPrice = parseFloat(row.current_price);
            const currentValue = quantity * currentPrice;
            totalValue += currentValue;

            holdings.push({
                symbol: row.symbol,
                quantity: quantity,
                avgPrice: parseFloat(row.avg_price),
                currentPrice: currentPrice,
                currentValue: currentValue,
                type: row.type
            });
        }

        for (const row of cryptoHoldings.rows) {
            const quantity = parseFloat(row.quantity);
            const currentPrice = parseFloat(row.current_price);
            const currentValue = quantity * currentPrice;
            totalValue += currentValue;

            holdings.push({
                symbol: row.symbol,
                quantity: quantity,
                avgPrice: parseFloat(row.avg_price),
                currentPrice: currentPrice,
                currentValue: currentValue,
                type: row.type
            });
        }

        return {
            totalValue,
            holdings
        };

    } catch (error) {
        console.error('Error in getUserPortfolio:', error);
        return { totalValue: 0, holdings: [] };
    }
}

export const getNetworthHistory = async (userId: string, days: number = 7) => {
    try {
        const result = await pool.query(`
            SELECT 
                snapshot_date as date,
                balance,
                portfolio_value,
                net_worth
            FROM net_worth_history
            WHERE user_id = $1 
                AND snapshot_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
            ORDER BY snapshot_date ASC
        `, [userId, days]);
        
        return result.rows;
        
    } catch (error) {
        console.error('Error getting net worth history:', error);
        return [];
    }
}

interface Transaction {
    transaction_id: number;
    type: 'BUY' | 'SELL';
    asset_type: 'STOCK' | 'CRYPTO';
    symbol_name: string;
    quantity: number;
    price_per_share: number;
    total_amount: number;
    transaction_date: Date;
}

interface GetTransactionsParams {
    userId: string;
    limit?: number;
    offset?: number;
    type?: 'BUY' | 'SELL';
    assetType?: 'STOCK' | 'CRYPTO';
}

export async function getTransactions(params: GetTransactionsParams): Promise<{
    transactions: Transaction[];
    total: number;
}> {
    const { userId, limit = 3, offset = 0, type, assetType } = params;
    
    try {
        let query = `
            SELECT 
                transaction_id,
                type,
                asset_type,
                symbol_name,
                quantity,
                price_per_share,
                total_amount,
                transaction_date
            FROM transactions
            WHERE user_id = $1
        `;
        
        const queryParams: any[] = [userId];
        let paramIndex = 2;
        
        if (type) {
            query += ` AND type = $${paramIndex}`;
            queryParams.push(type);
            paramIndex++;
        }
        
        if (assetType) {
            query += ` AND asset_type = $${paramIndex}`;
            queryParams.push(assetType);
            paramIndex++;
        }
        
        query += ` ORDER BY transaction_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);
        
        let countQuery = `
            SELECT COUNT(*) as total
            FROM transactions
            WHERE user_id = $1
        `;
        
        const countParams: any[] = [userId];
        let countIndex = 2;
        
        if (type) {
            countQuery += ` AND type = $${countIndex}`;
            countParams.push(type);
            countIndex++;
        }
        
        if (assetType) {
            countQuery += ` AND asset_type = $${countIndex}`;
            countParams.push(assetType);
        }
        
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);
        
        const result = await pool.query(query, queryParams);
        
        return {
            transactions: result.rows,
            total
        };
        
    } catch (error) {
        console.error('Error getting transactions:', error);
        return { transactions: [], total: 0 };
    }
}