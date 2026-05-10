import { Card } from "@/components/ui/card";
import { DollarSign, Wallet, TrendingUp, PieChart } from "lucide-react";

interface StatsCardsProps {
    portfolio: {
        totalValue: number;
        holdings: any[];
        cashBalance?: number;
    };
    networth: {
        net_worth?: string;
        balance?: string;
        portfolio_value?: string;
    };
    loading: boolean;
}

export const ExtraStats = ({ portfolio, networth, loading }: StatsCardsProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-3 sm:p-6 animate-pulse">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 sm:space-y-2">
                                <div className="h-3 sm:h-4 w-16 sm:w-20 bg-muted rounded" />
                                <div className="h-5 sm:h-8 w-20 sm:w-32 bg-muted rounded" />
                            </div>
                            <div className="h-6 w-6 sm:h-10 sm:w-10 bg-muted rounded-full" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    const cashBalance = networth?.balance ?? portfolio?.cashBalance ?? 0;
    const portfolioValue = portfolio?.totalValue ?? networth?.portfolio_value ?? 0;
    const netWorth = networth?.net_worth ?? (Number(cashBalance) + Number(portfolioValue));
    const holdingsCount = portfolio?.holdings?.length ?? 0;

    const stats = [
        { title: "Net Worth", value: netWorth, icon: DollarSign, format: "currency", trend: null, bgColor: "from-primary/20 to-primary/5" },
        { title: "Cash Balance", value: cashBalance, icon: Wallet, format: "currency", trend: "Available to trade", bgColor: "from-blue-500/20 to-blue-500/5" },
        { title: "Portfolio Value", value: portfolioValue, icon: TrendingUp, format: "currency", trend: holdingsCount > 0 ? `${holdingsCount} assets` : "No holdings", bgColor: "from-green-500/20 to-green-500/5" },
        { title: "Holdings", value: holdingsCount, icon: PieChart, format: "number", trend: holdingsCount === 1 ? "asset" : "assets", bgColor: "from-purple-500/20 to-purple-500/5" },
    ];

    const formatValue = (value: number, format: string) => {
        if (format === "currency") {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        }
        return value.toLocaleString();
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {stats.map((stat) => (
                <Card key={stat.title} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative p-3 sm:p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] sm:text-sm text-muted-foreground">{stat.title}</p>
                                <p className="text-sm sm:text-2xl font-bold mt-1 sm:mt-2">{formatValue(Number(stat.value), stat.format)}</p>
                                {stat.trend && <p className="text-[8px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{stat.trend}</p>}
                            </div>
                            <div className="p-1.5 sm:p-2 bg-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ExtraStats;