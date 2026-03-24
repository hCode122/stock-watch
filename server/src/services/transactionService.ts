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