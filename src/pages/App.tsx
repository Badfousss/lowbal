import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MessageSquare, User, Upload, Send, Copy, ArrowLeft, X, CheckCircle, Sparkles, Bot, Link as LinkIcon, Image, Eye } from "lucide-react";
import { calculateCounterOffer, generateNegotiationMessage } from '../utils/negotiationUtils';

interface Negotiation {
  id: string;
  title: string;
  category: string;
  platform: string;
  originalPrice: number;
  currentOffer?: number;
  tone: string;
  budget: number;
  status: 'setup' | 'active' | 'completed';
  messages: Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
}

const categories = [
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'cars', name: 'Cars', icon: '🚗' },
  { id: 'motorcycles', name: 'Motorcycles', icon: '🏍️' },
  { id: 'gadgets', name: 'Gadgets', icon: '📱' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' }
];

const tones = [
  { id: 'friendly', name: 'Friendly', desc: 'Warm and approachable' },
  { id: 'professional', name: 'Professional', desc: 'Business-like and formal' },
  { id: 'confident', name: 'Confident', desc: 'Direct and assertive' },
  { id: 'humble', name: 'Humble', desc: 'Polite and respectful' }
];

const AppPage = () => {
  const [activeTab, setActiveTab] = useState('start');
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [currentNegotiation, setCurrentNegotiation] = useState<Negotiation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    price: '',
    platform: '',
    tone: 'professional',
    budget: '',
    notes: ''
  });

  // Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // URL Parser states
  const [url, setUrl] = useState('');
  const [isParsingUrl, setIsParsingUrl] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  // Image states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const startNewNegotiation = () => {
    const newNegotiation: Negotiation = {
      id: Date.now().toString(),
      title: '',
      category: '',
      platform: '',
      originalPrice: 0,
      tone: 'professional',
      budget: 0,
      status: 'setup',
      messages: [],
      createdAt: new Date()
    };
    setCurrentNegotiation(newNegotiation);
    setActiveTab('negotiate');
  };

  const saveNegotiation = () => {
    if (!currentNegotiation) return;
    
    const updatedNegotiation = {
      ...currentNegotiation,
      title: formData.title,
      category: formData.category,
      platform: formData.platform,
      originalPrice: parseFloat(formData.price) || 0,
      tone: formData.tone,
      budget: parseFloat(formData.budget) || 0,
      status: 'active' as const
    };

    setNegotiations(prev => {
      const existing = prev.find(n => n.id === currentNegotiation.id);
      if (existing) {
        return prev.map(n => n.id === currentNegotiation.id ? updatedNegotiation : n);
      }
      return [...prev, updatedNegotiation];
    });

    setCurrentNegotiation(updatedNegotiation);
    toast({ title: "Negotiation Saved", description: "Your negotiation has been saved successfully." });
  };

  const generateOffer = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const price = parseFloat(formData.price);
      const budget = parseFloat(formData.budget) || price;
      
      if (price > budget) {
        toast({ title: "Budget Exceeded", description: "The listing price exceeds your budget.", variant: "destructive" });
        return;
      }

      const offer = calculateCounterOffer(price, formData.platform, formData.category);
      const finalOffer = Math.min(offer, budget);
      
      const message = await generateNegotiationMessage(
        formData.title, price, finalOffer, formData.platform, formData.notes, formData.category, formData.tone
      );

      if (currentNegotiation) {
        const aiMessage = {
          id: Date.now().toString(),
          type: 'ai' as const,
          content: `Suggested offer: $${finalOffer}\n\nMessage: ${message}`,
          timestamp: new Date()
        };

        setCurrentNegotiation(prev => prev ? {
          ...prev,
          currentOffer: finalOffer,
          messages: [...prev.messages, aiMessage]
        } : null);
      }

      toast({ title: "Offer Generated!", description: "Your negotiation strategy is ready." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate offer.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !currentNegotiation) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: chatMessage,
      timestamp: new Date()
    };

    setCurrentNegotiation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setChatMessage('');
    setIsChatLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "Based on your question, I recommend being flexible on timing but firm on price. Market data supports your offer range.",
        timestamp: new Date()
      };

      setCurrentNegotiation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiResponse]
      } : null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to get AI response.", variant: "destructive" });
    } finally {
      setIsChatLoading(false);
    }
  };

  const parseUrl = async () => {
    if (!url) return;
    setIsParsingUrl(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = {
        title: "MacBook Pro 13\" M2 - Like New",
        price: "1200",
        platform: "Facebook Marketplace",
        description: "Barely used, original packaging included"
      };
      
      setParsedData(mockData);
      setFormData(prev => ({ ...prev, ...mockData }));
      
      toast({ title: "URL Parsed!", description: "Listing information extracted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to parse URL.", variant: "destructive" });
    } finally {
      setIsParsingUrl(false);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setAnalysisResult({
        sentiment: 'positive',
        priceFlexibility: 'high',
        urgency: 'medium',
        suggestions: ['Seller seems motivated', 'Good time to negotiate', 'Mention quick pickup']
      });
      
      toast({ title: "Analysis Complete!", description: "Image analyzed successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to analyze image.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const betterDeals = [
    { title: "Similar MacBook Pro", savings: "$90", platform: "eBay" },
    { title: "MacBook Air M2", savings: "$150", platform: "Facebook" },
    { title: "MacBook Pro 14\"", savings: "$200", platform: "Craigslist" }
  ];

  const totalSavings = negotiations.filter(n => n.status === 'completed').reduce((sum, n) => sum + (n.originalPrice - (n.currentOffer || 0)), 0);
  const activeCount = negotiations.filter(n => n.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🧠 Lowbal</h1>
          <p className="text-sm text-gray-300">AI-Powered Negotiation Assistant</p>
        </div>
        <Link to="/account">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg">
            <User className="w-4 h-4 mr-2" />
            Account
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-600 p-4 rounded-xl">
          <p className="text-sm text-white/80">Total Saved</p>
          <h2 className="text-2xl font-bold">${totalSavings.toLocaleString()}</h2>
        </div>
        <div className="bg-blue-600 p-4 rounded-xl">
          <p className="text-sm text-white/80">Active</p>
          <h2 className="text-2xl font-bold">{activeCount}</h2>
        </div>
        <div className="bg-purple-600 p-4 rounded-xl">
          <p className="text-sm text-white/80">Success Rate</p>
          <h2 className="text-2xl font-bold">78%</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button 
          onClick={() => setActiveTab('start')}
          variant={activeTab === 'start' ? 'default' : 'outline'}
          className="font-semibold"
        >
          🏠 Start
        </Button>
        <Button 
          onClick={() => setActiveTab('negotiate')}
          variant={activeTab === 'negotiate' ? 'default' : 'outline'}
          className="font-semibold"
        >
          💬 Negotiate
        </Button>
        <Button 
          onClick={() => setActiveTab('active')}
          variant={activeTab === 'active' ? 'default' : 'outline'}
          className="font-semibold"
        >
          📋 Active ({activeCount})
        </Button>
        <Button 
          onClick={() => setActiveTab('history')}
          variant={activeTab === 'history' ? 'default' : 'outline'}
          className="font-semibold"
        >
          📊 History
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'start' && (
        <Card className="bg-white text-black p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Lowbal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">Start negotiating smarter with AI-powered strategies.</p>
            <Button onClick={startNewNegotiation} className="bg-green-600 text-white px-6 py-3 text-lg">
              <Plus className="w-5 h-5 mr-2" />
              Start New Negotiation
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'negotiate' && currentNegotiation && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => setActiveTab('start')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold">Setup Negotiation</h2>
          </div>

          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="url">URL Parser</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="image">Image Analyzer</TabsTrigger>
            </TabsList>

            <TabsContent value="setup">
              <Card className="bg-white text-black">
                <CardContent className="p-6 space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(cat => (
                        <Button
                          key={cat.id}
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                          variant={formData.category === cat.id ? 'default' : 'outline'}
                          className="text-sm"
                        >
                          {cat.icon} {cat.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Item Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., MacBook Pro 13\""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="1200"
                      />
                    </div>
                  </div>

                  {/* Platform & Tone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Platform</label>
                      <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Facebook Marketplace">Facebook Marketplace</SelectItem>
                          <SelectItem value="Craigslist">Craigslist</SelectItem>
                          <SelectItem value="eBay">eBay</SelectItem>
                          <SelectItem value="Zillow">Zillow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">AI Tone</label>
                      <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map(tone => (
                            <SelectItem key={tone.id} value={tone.id}>
                              {tone.name} - {tone.desc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Budget & Notes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Budget ($)</label>
                      <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional context..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={generateOffer} disabled={isLoading} className="bg-green-600 text-white flex-1">
                      {isLoading ? 'Generating...' : 'Generate Offer'}
                    </Button>
                    <Button onClick={saveNegotiation} variant="outline">
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="url">
              <Card className="bg-white text-black">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Listing URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://facebook.com/marketplace/item/..."
                        className="flex-1"
                      />
                      <Button onClick={parseUrl} disabled={isParsingUrl}>
                        {isParsingUrl ? 'Parsing...' : 'Parse'}
                      </Button>
                    </div>
                  </div>

                  {parsedData && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-bold text-green-800 mb-2">Parsed Successfully!</h3>
                        <p><strong>Title:</strong> {parsedData.title}</p>
                        <p><strong>Price:</strong> ${parsedData.price}</p>
                        <p><strong>Platform:</strong> {parsedData.platform}</p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Better Deals Found</h4>
                        <div className="space-y-2">
                          {betterDeals.map((deal, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                              <span>{deal.title}</span>
                              <span className="text-green-600 font-bold">Save {deal.savings}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card className="bg-white text-black">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-bold">AI Strategy Assistant</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                      {currentNegotiation?.messages?.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Ask me anything about your negotiation strategy!</p>
                          <div className="mt-4 space-y-1 text-sm">
                            <p>• "What's a good opening offer?"</p>
                            <p>• "How should I respond to their counter?"</p>
                            <p>• "What's the best time to negotiate?"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {currentNegotiation?.messages?.map(msg => (
                            <div key={msg.id} className={`p-3 rounded-lg ${
                              msg.type === 'ai' ? 'bg-blue-100' : 'bg-gray-200'
                            }`}>
                              <div className="font-bold text-xs mb-1">
                                {msg.type === 'ai' ? '🤖 AI Assistant' : '👤 You'}
                              </div>
                              <p className="text-sm">{msg.content}</p>
                              {msg.type === 'ai' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.content);
                                    toast({ title: "Copied!", description: "Message copied to clipboard." });
                                  }}
                                  className="mt-2 text-xs"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask about negotiation strategy..."
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      />
                      <Button onClick={sendChatMessage} disabled={isChatLoading}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image">
              <Card className="bg-white text-black">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Conversation Screenshot</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <img src={uploadedImage} alt="Uploaded" className="max-w-full h-48 mx-auto rounded-lg" />
                          <p className="text-green-600 font-medium">Image uploaded successfully!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                          <p className="text-gray-600">Upload a conversation screenshot</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="inline-block mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                        Choose Image
                      </label>
                    </div>
                  </div>

                  <Button onClick={analyzeImage} disabled={isAnalyzing || !uploadedImage} className="w-full">
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Conversation'}
                  </Button>

                  {analysisResult && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-bold text-blue-800 mb-2">Analysis Results</h3>
                        <p><strong>Sentiment:</strong> {analysisResult.sentiment}</p>
                        <p><strong>Price Flexibility:</strong> {analysisResult.priceFlexibility}</p>
                        <p><strong>Urgency:</strong> {analysisResult.urgency}</p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Better Deals Found</h4>
                        <div className="space-y-2">
                          {betterDeals.map((deal, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                              <span>{deal.title}</span>
                              <span className="text-green-600 font-bold">Save {deal.savings}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {activeTab === 'active' && (
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Active Negotiations</CardTitle>
          </CardHeader>
          <CardContent>
            {negotiations.filter(n => n.status === 'active').length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No active negotiations</p>
                <Button onClick={startNewNegotiation} className="bg-green-600 text-white">
                  Start New Negotiation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {negotiations.filter(n => n.status === 'active').map(negotiation => (
                  <div key={negotiation.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-bold">{negotiation.title || 'Untitled'}</h3>
                      <p className="text-sm text-gray-600">
                        {negotiation.category} • ${negotiation.originalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setCurrentNegotiation(negotiation);
                          setActiveTab('negotiate');
                        }}
                        size="sm"
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => setNegotiations(prev => prev.filter(n => n.id !== negotiation.id))}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Negotiation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No completed negotiations yet</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppPage;