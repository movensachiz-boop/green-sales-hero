import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-accent py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6 animate-fade-in">
              <img src={logo} alt="Vision System Logo" className="h-20 md:h-28" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Vision System
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto">
              Sales Tracking & Analytics Platform
            </p>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Powered by Greenworld - Led by Professor Mabuya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8 shadow-lg hover:scale-105 transition-transform">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Powerful Features for Sales Excellence
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Real-time Analytics"
              description="Track sales performance across all branches instantly"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Performance Rankings"
              description="Weekly and monthly leaderboards for top performers"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Team Management"
              description="Manage agents and branch managers efficiently"
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-primary" />}
              title="City Tracking"
              description="Monitor sales performance across all Zimbabwe cities"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join Vision System today and take your sales tracking to the next level
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
