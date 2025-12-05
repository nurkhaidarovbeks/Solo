
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { 
  Cloud, Shield, Zap, Users, Download, Upload, FolderOpen, 
  Check, Sparkles, Lock, Globe, Clock, CreditCard
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption keeps your files safe and secure"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Upload and access your files instantly from anywhere"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on files with your team seamlessly"
    },
    {
      icon: FolderOpen,
      title: "Smart Organization",
      description: "Organize your files with intelligent folder structures"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use",
      features: [
        "5 GB Storage",
        "Basic file sharing",
        "Standard upload speed",
        "Email support",
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Perfect for professionals",
      features: [
        "100 GB Storage",
        "Advanced file sharing",
        "Priority upload speed",
        "24/7 priority support",
        "Password protected files",
        "Version history"
      ],
      cta: "Start Free Trial",
      highlight: true
    },
    {
      name: "Business",
      price: "$24.99",
      period: "per month",
      description: "Perfect for teams",
      features: [
        "1 TB Storage",
        "Team workspaces",
        "Admin controls",
        "API access",
        "Single Sign-On (SSO)",
        "Custom branding"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  const stats = [
    { value: "10M+", label: "Users", color: "from-blue-600 to-blue-400" },
    { value: "500TB", label: "Data Stored", color: "from-purple-600 to-purple-400" },
    { value: "99.9%", label: "Uptime", color: "from-green-600 to-green-400" },
    { value: "150+", label: "Countries", color: "from-amber-600 to-amber-400" }
  ];
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in order-2 md:order-1">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your files,
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  everywhere
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Store, sync, and share your files securely with enterprise-grade cloud storage. 
                Access your data from anywhere, anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Upload className="mr-2 h-5 w-5" />
                    Start Free Today
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 w-full sm:w-auto">
                    <Download className="mr-2 h-5 w-5" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating UI mockup */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-500 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                        <Cloud className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-gray-900">Saqtau</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                    <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
                    <div className="flex space-x-2">
                      <div className="h-16 bg-blue-100 rounded-lg w-1/3"></div>
                      <div className="h-16 bg-purple-100 rounded-lg w-1/3"></div>
                      <div className="h-16 bg-green-100 rounded-lg w-1/3"></div>
                    </div>
                  </div>
                </div>
                
                {/* Secondary floating element */}
                <div className="absolute -bottom-10 -right-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-4 w-48 h-48 animate-float"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-3 inline-block">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Saqtau</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of cloud storage with cutting-edge features designed for modern teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1600x800?blue,abstract')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1 rounded-full mb-3 inline-block">Seamless Experience</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Designed for productivity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our intuitive interface makes file management a breeze
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-w-4xl mx-auto transform hover:scale-[1.02] transition-all duration-500">
            <div className="h-8 bg-gray-100 flex items-center px-4 border-b border-gray-200">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 h-96">
              <div className="bg-gray-50 border-r border-gray-200 md:col-span-1 p-4">
                <div className="h-8 bg-blue-100 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-5/6"></div>
                  <div className="h-6 bg-blue-200 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-4/5"></div>
                </div>
              </div>
              <div className="md:col-span-3 p-6">
                <div className="h-10 bg-gray-100 rounded-lg w-full mb-6"></div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-24 bg-blue-50 rounded-lg border border-blue-100"></div>
                  <div className="h-24 bg-green-50 rounded-lg border border-green-100"></div>
                  <div className="h-24 bg-purple-50 rounded-lg border border-purple-100"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full mb-3 inline-block">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your storage needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`h-full flex flex-col ${plan.highlight 
                  ? 'border-2 border-blue-500 shadow-xl shadow-blue-100' 
                  : 'border shadow-lg'} 
                  hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}
              >
                {plan.highlight && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-center text-white text-sm font-semibold">
                    <Sparkles className="h-4 w-4 inline-block mr-1" /> Most Popular
                  </div>
                )}
                <CardHeader className={plan.highlight ? "pt-6" : ""}>
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="ml-2 text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="px-6 pb-6 pt-0">
                  {plan.name === "Premium" && plan.cta === "Start Free Trial" ? (
                    <Link to="/register" className="w-full">
                      <Button 
                        className={`w-full py-6 ${plan.highlight 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                          : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400'}`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className={`w-full py-6 ${plan.highlight 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                        : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400'}`}
                      // For "Contact Sales" or other CTAs, you might navigate or open a modal
                      onClick={() => {
                        if (plan.cta === "Get Started") navigate("/register");
                        // else if (plan.cta === "Contact Sales") // handle contact
                      }}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trusted by companies worldwide</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-6 bg-gray-400 rounded-lg w-3/4"></div>
            </div>
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-6 bg-gray-400 rounded-lg w-3/4"></div>
            </div>
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-6 bg-gray-400 rounded-lg w-3/4"></div>
            </div>
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-6 bg-gray-400 rounded-lg w-3/4"></div>
            </div>
          </div>
          <div className="flex justify-center mt-8 gap-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Secure by design</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Global infrastructure</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">99.9% uptime</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">GDPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Saqtau with their most important files
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Create Your Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full animate-pulse delay-1000" />
      </section>
    </>
  );
};

export default LandingPage;
