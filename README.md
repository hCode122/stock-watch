# StockWatch - Trading Simulator

A full-stack trading application where users can practice trading stocks and cryptocurrencies with virtual currency. Real-time market data, portfolio tracking, and performance analytics.

## Live Demo

Frontend: [Try here!](https://stock-watch-five.vercel.app/)

## Technical Stack

### Frontend
- React 18 with Next.js 14 App Router
- TypeScript for type safety
- Redux Toolkit for state management (auth, portfolio data)
- React Hook Form with Zod validation
- Tailwind CSS for responsive design (320px to 4K)
- Recharts for data visualization
- Shadcn/ui for component library

### Backend
- Node.js with Express
- JWT authentication with bcrypt password hashing
- PostgreSQL database with 12 normalized tables
- Integration with 3 financial APIs (Alpha Vantage, CoinGecko, CoinMarketCap)
- Daily price caching strategy to bypass API rate limits
- Scheduled data refresh jobs via GitHub Actions


## Key Features

### Authentication
- JWT-based auth with secure HTTP-only cookies
- Password hashing with bcrypt
- Protected routes on frontend and backend
- Remember me functionality

### Portfolio Management
- Weighted average cost basis calculation for multi-buy positions
- Real-time profit/loss tracking per asset and total portfolio
- Transaction history with buy/sell records
- Holdings table with quantity, average price, current value

### Dashboard
- Net worth chart with 7-day historical tracking
- Extra stats cards for quick overview (balance, portfolio value, net worth)
- Responsive design with dark/light mode support

### Market Pages
- Stock and crypto listings with real-time prices
- Buy/sell modal with balance validation and future balance preview
- Filter by top gainers, losers, most traded


## Architecture

### Data Flow
External APIs → Daily cron job → PostgreSQL storage → Express API → React frontend

The application does not call external APIs directly from the frontend. All price data is stored locally after daily updates, which solves rate limit constraints from free API tiers.

### Rate Limiting Strategy
- Single daily fetch from external APIs (Alpha Vantage, CoinGecko, CoinMarketCap)
- Data cached in local PostgreSQL tables
- Frontend reads only from local database
- Enables unlimited user requests without hitting API limits

### Scheduled Jobs
- Daily price updates for stocks and crypto
- Daily net worth snapshots for historical charts
- Market overview and calculations refresh
- Orchestrated via GitHub Actions scheduled workflows

## Deployment

- Frontend: Vercel (serverless deployment)
- Backend: Render (web service)
- Database: Render PostgreSQL
- Scheduled jobs: GitHub Actions (cron schedules)


## Why This Project

Built to demonstrate:
- Full-stack development across React and Node.js
- Database design with relational schemas and foreign key constraints
- Third-party API integration with rate limit handling
- Complex business logic (financial calculations, weighted averages)
- Responsive UI with dark/light mode
- Automated scheduled tasks
- Production deployment with CI/CD pipeline