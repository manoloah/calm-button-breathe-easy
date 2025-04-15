
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp 
          ? "Please check your email to verify your account."
          : "You have been successfully logged in.",
      });

      if (!isSignUp) navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-unbounded text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-[#B0B0B0]">
            {isSignUp 
              ? 'Sign up to start managing your anxiety'
              : 'Sign in to continue your journey'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00B383] hover:bg-[#00956D] text-white"
          >
            {isLoading ? (
              "Loading..."
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#B0B0B0] hover:text-white text-sm"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
