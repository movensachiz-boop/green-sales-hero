import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Leaderboard = () => {
  const weeklyLeaders = [
    { rank: 1, name: "Sarah Moyo", city: "Harare", sales: "$12,450", transactions: 45 },
    { rank: 2, name: "John Ndlovu", city: "Bulawayo", sales: "$10,200", transactions: 38 },
    { rank: 3, name: "Grace Makoni", city: "Mutare", sales: "$9,800", transactions: 36 },
    { rank: 4, name: "David Chikara", city: "Gweru", sales: "$8,500", transactions: 32 },
    { rank: 5, name: "Mary Sibanda", city: "Kwekwe", sales: "$7,900", transactions: 29 },
  ];

  const monthlyLeaders = [
    { rank: 1, name: "Sarah Moyo", city: "Harare", sales: "$48,200", transactions: 180 },
    { rank: 2, name: "John Ndlovu", city: "Bulawayo", sales: "$42,500", transactions: 165 },
    { rank: 3, name: "Grace Makoni", city: "Mutare", sales: "$39,100", transactions: 152 },
    { rank: 4, name: "David Chikara", city: "Gweru", sales: "$35,800", transactions: 142 },
    { rank: 5, name: "Mary Sibanda", city: "Kwekwe", sales: "$32,400", transactions: 128 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Leaderboard</h1>
          <p className="text-muted-foreground">Top performing sales agents across Zimbabwe</p>
        </div>

        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Top Performers</CardTitle>
                <CardDescription>Rankings for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardTable data={weeklyLeaders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Top Performers</CardTitle>
                <CardDescription>Rankings for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardTable data={monthlyLeaders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const LeaderboardTable = ({ data }: { data: any[] }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-3">
      {data.map((leader) => (
        <div
          key={leader.rank}
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 flex justify-center">{getRankIcon(leader.rank)}</div>
            <div>
              <p className="font-semibold text-card-foreground">{leader.name}</p>
              <p className="text-sm text-muted-foreground">{leader.city}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-success">{leader.sales}</p>
            <Badge variant="secondary" className="mt-1">
              {leader.transactions} sales
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
