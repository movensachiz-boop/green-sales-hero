import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Users, MapPin, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import visionLogo from "@/assets/vision-system-hero.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center px-4">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-10 opacity-0 animate-fade-in-scale">
              
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/90 text-sm font-medium mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-4 w-4" />
              Powered by Greenworld
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-primary-foreground mb-6 opacity-0 animate-slide-up tracking-tight leading-[0.9]" style={{ animationDelay: '0.3s' }}>
              Vision System
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-4 max-w-2xl mx-auto font-light opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Sales Tracking & Analytics Platform
            </p>
            
            <p className="text-base md:text-lg text-primary-foreground/60 mb-12 max-w-xl mx-auto opacity-0 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              Led by Professor Mabuya — track performance, manage inventory, and grow your team.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Link to="/auth">
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 rounded-2xl font-semibold group">

                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-0 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              {[
              { label: "Active Agents", value: "100+" },
              { label: "Products", value: "65+" },
              { label: "Cities", value: "10+" }].
              map((stat) =>
              <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/50 mt-1">{stat.label}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Everything you need for
              <span className="gradient-text"> sales excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform to track, analyze, and optimize your team's performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Real-time Analytics"
              description="Track sales performance across all branches with live data" />

            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Leaderboards"
              description="Weekly and monthly rankings for top performers" />

            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Team Management"
              description="Manage agents and track individual contributions" />

            <FeatureCard
              icon={<MapPin className="h-6 w-6" />}
              title="City Tracking"
              description="Monitor sales across all Zimbabwe cities" />

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
            { icon: <Zap className="h-8 w-8" />, title: "Lightning Fast", desc: "Record sales in seconds with our streamlined interface" },
            { icon: <Shield className="h-8 w-8" />, title: "Secure & Reliable", desc: "Your data is protected with enterprise-grade security" },
            { icon: <Sparkles className="h-8 w-8" />, title: "Smart Insights", desc: "AI-powered analytics to help you make better decisions" }].
            map((item) =>
            <div key={item.title} className="flex items-start gap-4 p-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to transform your sales?
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-10 max-w-xl mx-auto">
            Join Vision System today and take your team's performance to the next level
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="text-lg px-10 py-7 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 rounded-2xl font-semibold group">

              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Vision System" className="h-6 opacity-60" />
            <span className="text-sm text-muted-foreground">Vision System © 2026</span>
          </div>
          <p className="text-sm text-muted-foreground">Powered by Greenworld</p>
          <p className="text-sm text-muted-foreground">Designed by Envoy <a href="https://wa.me/263786133259" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">+263786133259</a></p>
        </div>
      </footer>
    </div>);

};

const FeatureCard = ({ icon, title, description }: {icon: React.ReactNode;title: string;description: string;}) =>
<div className="group relative bg-card rounded-2xl p-6 border border-border shadow-sm card-hover">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-display font-semibold mb-2 text-card-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>;


export default Index;