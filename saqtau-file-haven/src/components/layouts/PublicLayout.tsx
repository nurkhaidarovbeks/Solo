import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";

const Navbar = () => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Saqtau
            </span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
          <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
          <Link to="/testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</Link>
          <Link to="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 transition-colors">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Saqtau</span>
          </div>
          <p className="text-gray-400 mb-4">
            Secure cloud storage for everyone. Access your files anywhere, anytime.
          </p>
          {/* Social Icons can be added here if needed */}
        </div>
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li> {/* Placeholder */}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li> {/* Placeholder */}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li> {/* Placeholder */}
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li> {/* Placeholder */}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 mb-4 md:mb-0">
          © {new Date().getFullYear()} Saqtau. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a> {/* Placeholder */}
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a> {/* Placeholder */}
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a> {/* Placeholder */}
        </div>
      </div>
    </div>
  </footer>
);

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This is where the page content will be rendered */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
