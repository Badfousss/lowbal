import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Crown, Shield, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567'
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    deals: true
  });
  const { toast } = useToast();

  const subscriptionTiers = [
    {
      name: 'Free',
      price: '$0',
      features: ['5 negotiations/month', 'Basic AI responses'],
      current: true
    },
    {
      name: 'Pro',
      price: '$9.99',
      features: ['Unlimited negotiations', 'Advanced AI', 'URL parser', 'Image analyzer'],
      popular: true
    },
    {
      name: 'Premium',
      price: '$19.99',
      features: ['Everything in Pro', 'Market analysis', 'Custom templates', '24/7 support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Link to="/app" className="text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/20 backdrop-blur-xl rounded-2xl p-2 h-14 border border-white/20">
              <TabsTrigger value="profile" className="font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="subscription" className="font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-300">
                <Crown className="w-4 h-4 mr-2" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="settings" className="font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-gray-300">
                <Shield className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-800">$3,247</div>
                      <div className="text-sm text-green-600">Total Saved</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-800">23</div>
                      <div className="text-sm text-blue-600">Deals Closed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-800">78%</div>
                      <div className="text-sm text-purple-600">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="space-y-6">
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
                        <p className="text-gray-600">5 negotiations remaining this month</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">Current</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  {subscriptionTiers.map((tier, index) => (
                    <Card key={index} className={`shadow-2xl border-0 bg-white/95 backdrop-blur-xl ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                      {tier.popular && (
                        <div className="text-center py-2 bg-blue-500 text-white text-sm font-bold rounded-t-lg">
                          <Star className="w-4 h-4 inline mr-1" />
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                        <div className="text-3xl font-bold mb-4">{tier.price}<span className="text-sm text-gray-600">/month</span></div>
                        <ul className="space-y-2 mb-6">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <Check className="w-4 h-4 text-green-600 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button className={`w-full ${tier.current ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white'}`} disabled={tier.current}>
                          {tier.current ? 'Current Plan' : `Upgrade to ${tier.name}`}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-bold">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates about negotiations</p>
                      </div>
                      <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-bold">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Get notified about responses</p>
                      </div>
                      <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications({...notifications, push: checked})} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-bold">Deal Suggestions</h4>
                        <p className="text-sm text-gray-600">Receive better deal recommendations</p>
                      </div>
                      <Switch checked={notifications.deals} onCheckedChange={(checked) => setNotifications({...notifications, deals: checked})} />
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-3">
                    <Button variant="outline" className="w-full">Export My Data</Button>
                    <Button variant="destructive" className="w-full">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;