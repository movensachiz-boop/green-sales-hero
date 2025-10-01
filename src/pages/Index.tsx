import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-4">
        {/* Gradient Background with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        
        {/* Animated Glow Effects */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            {/* Logo with Glass Effect */}
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-8 animate-fade-in border border-white/20">
              <div className="bg-white rounded-2xl p-4 shadow-inner">
                <img src={logo} alt="Vision System Logo" className="h-24 md:h-32" />
              </div>
            </div>
            
            {/* Main Heading with Gradient Text */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in tracking-tight">
              Vision System
            </h1>
            
            {/* Subtitle with Enhanced Styling */}
            <p className="text-2xl md:text-3xl lg:text-4xl text-white/95 mb-4 max-w-4xl mx-auto font-light animate-fade-in">
              Sales Tracking & Analytics Platform
            </p>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto animate-fade-in font-light">
              Powered by Greenworld - Led by Professor Mabuya
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-10 py-6 shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] font-semibold"
                >
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
            
            {/* Decorative Elements */}
            <div className="mt-16 flex justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '1s' }} />
                <span>Easy to Use</span>
              </div>
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
