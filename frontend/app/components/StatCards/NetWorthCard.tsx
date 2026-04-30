import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";

interface NetWorthData {
  date: string;
  balance: string;
  portfolio_value: string;
  net_worth: string;
}

interface CardProps {
  data: NetWorthData[];
  loading: boolean;
  error: string | null;
}

export const NetWorthCard = ({ data, loading, error }: CardProps) => {
  const [isMobile, setIsMobile] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
        setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    checkDarkMode()
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                checkDarkMode()
            }
        })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    return () => observer.disconnect()
}, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-6 sm:size-8" />
          <p className="text-xs sm:text-sm text-muted-foreground">Loading net worth data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md w-full flex flex-col justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8 p-4 sm:p-8">
        <div className="flex items-start gap-2 max-w-full">
          <span className="rounded-full w-3 h-3 bg-red-600 mt-1 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-muted text-left">{error}</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-md w-full flex justify-center items-center min-h-[280px] bg-card mt-4 sm:mt-8">
        <p className="text-xs sm:text-sm text-muted-foreground">No net worth data available</p>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    fullDate: format(new Date(item.date), "MMM dd, yyyy"),
    balance: parseFloat(item.balance),
    portfolioValue: parseFloat(item.portfolio_value),
    netWorth: parseFloat(item.net_worth),
  }));

  const latestNetWorth = chartData[chartData.length - 1]?.netWorth || 0;
  const firstNetWorth = chartData[0]?.netWorth || 0;
  const netWorthChange = latestNetWorth - firstNetWorth;
  const netWorthChangePercent = firstNetWorth !== 0 ? (netWorthChange / firstNetWorth) * 100 : 0;
  const isPositive = netWorthChange >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg shadow-lg p-2 sm:p-4 text-xs sm:text-sm">
          <p className="font-semibold mb-1 sm:mb-2">{payload[0]?.payload.fullDate || label}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-3 sm:gap-4">
              <span className="text-muted-foreground">Net Worth:</span>
              <span className="font-medium">{formatCurrency(payload[0]?.value)}</span>
            </p>
            <p className="flex justify-between gap-3 sm:gap-4">
              <span className="text-muted-foreground">Portfolio:</span>
              <span className="font-medium">{formatCurrency(payload[1]?.value)}</span>
            </p>
            <p className="flex justify-between gap-3 sm:gap-4">
              <span className="text-muted-foreground">Cash Balance:</span>
              <span className="font-medium">{formatCurrency(payload[2]?.value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md w-full bg-card mt-4 sm:mt-8 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Net Worth Overview</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Last {data.length} days</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold">{formatCurrency(latestNetWorth)}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs sm:text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
            <span>{isPositive ? '+' : ''}{netWorthChange.toFixed(2)} ({netWorthChangePercent.toFixed(1)}%)</span>
            <span className="text-muted-foreground text-[10px] sm:text-xs">vs start</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] sm:h-[250px] md:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a0d8d9" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#073e3f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date"  tick={{ fontSize: isMobile ? 10 : 12, fill: isDarkMode ? "#ffffff" : "#1c1816" }}    tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCurrency}  tick={{ fontSize: isMobile ? 10 : 12, fill: isDarkMode ? "#ffffff" : "#1c1816" }} tickLine={false} axisLine={false} width={isMobile ? 50 : 80} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="netWorth" stroke="#21d7da" strokeWidth={2} fill="url(#netWorthGradient)" dot={{ r: isMobile ? 3 : 5, fill: "#21d7da", strokeWidth: 2 }} activeDot={{ r: isMobile ? 5 : 6 }} />
            <Line type="monotone" dataKey="portfolioValue" stroke="#215cda" strokeWidth={2} dot={{ r: isMobile ? 2 : 4, fill: "#215cda", strokeWidth: 1 }} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="balance" stroke="#6b21da" strokeWidth={2} dot={{ r: isMobile ? 2 : 4, fill: "#6b21da", strokeWidth: 1 }} strokeDasharray="5 5" />
            <ReferenceLine 
              y={firstNetWorth} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3"
              label={{ 
                value: "Start", 
                position: "left", 
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10 
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4 pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#21d7da]" />
          <span className="text-xs sm:text-sm">Net Worth</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#215cda]" />
          <span className="text-xs sm:text-sm">Portfolio Value</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#6b21da]" />
          <span className="text-xs sm:text-sm">Cash Balance</span>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 border-t">
        <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Peak</p>
            <p className="text-sm font-semibold">{formatCurrency(Math.max(...chartData.map(d => d.netWorth)))}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-sm font-semibold">{formatCurrency(chartData.reduce((sum, d) => sum + d.netWorth, 0) / chartData.length)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-sm font-semibold text-primary">{formatCurrency(latestNetWorth)}</p>
          </div>
        </div>
        
        <div className="hidden sm:flex justify-evenly gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Peak</p>
            <p className="text-sm font-semibold">{formatCurrency(Math.max(...chartData.map(d => d.netWorth)))}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-sm font-semibold">{formatCurrency(chartData.reduce((sum, d) => sum + d.netWorth, 0) / chartData.length)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-sm font-semibold text-primary">{formatCurrency(latestNetWorth)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};