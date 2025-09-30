import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome to Vision System</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Sales"
            value="$124,500"
            description="+20.1% from last month"
            icon={<DollarSign className="h-4 w-4 text-success" />}
          />
          <StatsCard
            title="Active Agents"
            value="45"
            description="+3 new this month"
            icon={<Users className="h-4 w-4 text-primary" />}
          />
          <StatsCard
            title="Top Performer"
            value="Sarah M."
            description="$12,450 this month"
            icon={<Award className="h-4 w-4 text-accent" />}
          />
          <StatsCard
            title="Growth Rate"
            value="+18.2%"
            description="vs. last quarter"
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>Latest transactions from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                agent="Sarah Moyo"
                product="Herbal Capsules A"
                amount="$450"
                city="Harare"
                time="2 hours ago"
              />
              <ActivityItem
                agent="John Ndlovu"
                product="Herbal Mix B"
                amount="$320"
                city="Bulawayo"
                time="4 hours ago"
              />
              <ActivityItem
                agent="Grace Makoni"
                product="Wellness Pack C"
                amount="$780"
                city="Mutare"
                time="5 hours ago"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const StatsCard = ({ title, value, description, icon }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ agent, product, amount, city, time }: {
  agent: string;
  product: string;
  amount: string;
  city: string;
  time: string;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{agent}</p>
        <p className="text-sm text-muted-foreground">{product} • {city}</p>
      </div>
      <div className="text-right space-y-1">
        <p className="text-sm font-semibold text-success">{amount}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

export default Dashboard;
