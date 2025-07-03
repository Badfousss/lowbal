import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Zap, Target, ArrowRight, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: "Input Details",
      description: "Add item info, set your budget and tone preferences.",
      gradient: "from-emerald-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "AI Strategy",
      description: "Get optimal offers and persuasive messages instantly.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Close Deals",
      description: "Send AI-crafted messages and save money consistently.",
      gradient: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="w-8 h-8 bg-white/90 rounded-xl flex items-center justify-center">
                    <div className="text-transparent bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text font-black text-lg">L</div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Lowbal</h1>
                  <p className="text-xs text-gray-300 font-medium">AI Negotiation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/20 font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-6 py-2 rounded-xl">
                    Try Free
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              Trusted by 50,000+ smart shoppers
            </div>
            
            <h2 className="text-6xl font-black text-white leading-tight">
              Never Pay
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"> Full Price </span>
              Again
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-3xl mx-auto">
              AI-powered negotiation assistant that crafts perfect messages and calculates optimal offers for any marketplace.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 max-w-2xl mx-auto">
              <div className="text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">73%</div>
                <div className="text-white/80 font-medium">Success Rate</div>
              </div>
              <div className="text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">$1,247</div>
                <div className="text-white/80 font-medium">Avg. Savings</div>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">2.3M</div>
                <div className="text-white/80 font-medium">Deals Closed</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Start Negotiating Now
                  <Zap className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20 bg-black/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-black text-white mb-4">How Lowbal Works</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-4">{feature.title}</h4>
                    <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-4xl font-black text-white mb-8">
              Ready to Save Money?
            </h3>
            <Link to="/app">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 font-black">
                Start Free
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <p className="text-white mt-6 text-lg font-bold">
              No signup required • Works instantly • Free forever
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/50 backdrop-blur-xl py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-200 font-bold">
              © 2024 Lowbal. AI-powered negotiation made simple.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;