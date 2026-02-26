import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, User } from "lucide-react";
import logo from "@/assets/logo.png";
import authBg from "@/assets/auth-bg.jpg";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Your account has been created. You can now sign in." });
      setEmail(""); setPassword(""); setFullName("");
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    setLoading(false);
    if (error) toast({ title: "Guest login failed", description: error.message, variant: "destructive" });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={authBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] rounded-full bg-accent/20 blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-5">
            <div className="bg-primary/10 rounded-2xl p-4">
              <img src={logo} alt="Vision System Logo" className="h-14" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
          <CardDescription>Sign in to Vision System</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl">
              <TabsTrigger value="signin" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="rounded-xl h-11" />
                </div>
                <Button type="submit" className="w-full rounded-xl h-11 font-semibold group" disabled={loading}>
                  {loading ? "Signing in..." : <>Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="rounded-xl h-11" />
                </div>
                <Button type="submit" className="w-full rounded-xl h-11 font-semibold" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t border-border">
            <Button type="button" variant="ghost" className="w-full rounded-xl h-11 text-muted-foreground hover:text-foreground" onClick={handleGuestLogin} disabled={loading}>
              <User className="mr-2 h-4 w-4" />
              {loading ? "Entering..." : "Continue as Guest"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              No account needed — explore with limited access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
