import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, Users, DollarSign } from "lucide-react";

const Cities = () => {
  const cityData = [
    {
      name: "Harare",
      totalSales: "$48,200",
      agents: 12,
      topAgent: "Sarah Moyo",
      growth: "+24%",
    },
    {
      name: "Bulawayo",
      totalSales: "$38,500",
      agents: 9,
      topAgent: "John Ndlovu",
      growth: "+18%",
    },
    {
      name: "Mutare",
      totalSales: "$32,100",
      agents: 7,
      topAgent: "Grace Makoni",
      growth: "+22%",
    },
    {
      name: "Gweru",
      totalSales: "$28,400",
      agents: 6,
      topAgent: "David Chikara",
      growth: "+15%",
    },
    {
      name: "Kwekwe",
      totalSales: "$24,800",
      agents: 5,
      topAgent: "Mary Sibanda",
      growth: "+19%",
    },
    {
      name: "Masvingo",
      totalSales: "$21,200",
      agents: 6,
      topAgent: "Peter Musa",
      growth: "+12%",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">City Performance</h1>
          <p className="text-muted-foreground">Sales statistics across Zimbabwe</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cityData.map((city) => (
            <Card key={city.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{city.name}</CardTitle>
                <MapPin className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">Total Sales</span>
                    </div>
                    <span className="font-bold text-success">{city.totalSales}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Active Agents</span>
                    </div>
                    <span className="font-semibold">{city.agents}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Growth</span>
                    </div>
                    <span className="font-semibold text-accent">{city.growth}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">Top Performer</p>
                  <p className="font-medium text-card-foreground">{city.topAgent}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cities;
