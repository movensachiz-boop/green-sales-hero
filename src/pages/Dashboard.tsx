import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Award, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to Vision System</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Sales"
            value="$124,500"
            description="+20.1% from last month"
            icon={<DollarSign className="h-5 w-5" />}
            trend="up"
          />
          <StatsCard
            title="Active Agents"
            value="45"
            description="+3 new this month"
            icon={<Users className="h-5 w-5" />}
            trend="up"
          />
          <StatsCard
            title="Top Performer"
            value="Sarah M."
            description="$12,450 this month"
            icon={<Award className="h-5 w-5" />}
          />
          <StatsCard
            title="Growth Rate"
            value="+18.2%"
            description="vs. last quarter"
            icon={<TrendingUp className="h-5 w-5" />}
            trend="up"
          />
        </div>

        {/* Recent Activity */}
        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Recent Activity</CardTitle>
            <CardDescription>Latest transactions from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <ActivityItem agent="Sarah Moyo" product="Herbal Capsules A" amount="$450" city="Harare" time="2 hours ago" />
              <ActivityItem agent="John Ndlovu" product="Herbal Mix B" amount="$320" city="Bulawayo" time="4 hours ago" />
              <ActivityItem agent="Grace Makoni" product="Wellness Pack C" amount="$780" city="Mutare" time="5 hours ago" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const StatsCard = ({ title, value, description, icon, trend }: { 
  title: string; value: string; description: string; icon: React.ReactNode; trend?: string;
}) => (
  <Card className="rounded-2xl shadow-sm border-border/60 card-hover">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-display font-bold text-foreground">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-success" />}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const ActivityItem = ({ agent, product, amount, city, time }: {
  agent: string; product: string; amount: string; city: string; time: string;
}) => (
  <div className="flex items-center justify-between py-3.5 border-b border-border/40 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold font-display">
        {agent.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{agent}</p>
        <p className="text-xs text-muted-foreground">{product} · {city}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-success">{amount}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
);

export default Dashboard;
