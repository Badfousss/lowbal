import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isSignup = type === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignup && password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      if (email && password) {
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: isSignup ? "Account Created" : "Login Successful",
          description: isSignup ? "Welcome to Lowbal!" : "Welcome back!",
        });
        navigate('/app');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center">
                <div className="text-transparent bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text font-black text-xl">L</div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Lowbal
          </h1>
          <p className="text-gray-200 text-lg font-bold">
            {isSignup ? "Join thousands of smart shoppers" : "Welcome back!"}
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center font-black text-gray-900">
              {isSignup ? "Create Account" : "Sign In"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 text-base border-2 bg-white text-gray-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignup ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 pr-12 text-base border-2 bg-white text-gray-900 font-medium"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {isSignup && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 pl-10 text-base border-2 bg-white text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    {isSignup ? "Creating..." : "Signing In..."}
                  </>
                ) : (
                  <>
                    {isSignup ? <User className="w-5 h-5 mr-3" /> : <Sparkles className="w-5 h-5 mr-3" />}
                    {isSignup ? "Create Account" : "Sign In"}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-gray-700 font-bold">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <Link 
                  to={isSignup ? "/login" : "/signup"} 
                  className="text-emerald-600 hover:text-emerald-700 font-black"
                >
                  {isSignup ? "Sign in" : "Sign up free"}
                </Link>
              </p>
              <Link to="/" className="text-gray-600 hover:text-gray-800 font-bold">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;