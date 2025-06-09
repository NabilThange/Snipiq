"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  FileText,
  MessageCircle,
  BarChart3,
  Upload,
  ArrowRight,
  Check,
  Star,
  Users,
  Zap,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  const handleGetStarted = () => {
    // Navigate to main app
    window.location.href = "/"
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email signup
    console.log("Email signup:", email)
  }

  return (
    <div className="min-h-screen bg-white font-bold">
      {/* Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#FFFF00] border-4 border-black flex items-center justify-center mr-3">
                <span className="text-black font-black text-xl">S</span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tight font-mono text-black">
                Snipiq
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-black font-bold uppercase hover:text-[#FF3F3F] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-black font-bold uppercase hover:text-[#FF3F3F] transition-colors">
                How it works
              </a>
              <a href="#testimonials" className="text-black font-bold uppercase hover:text-[#FF3F3F] transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-black font-bold uppercase hover:text-[#FF3F3F] transition-colors">
                Contact
              </a>
            </nav>

            {/* CTA Button */}
            <Button
              onClick={handleGetStarted}
              className="bg-[#FFFF00] border-4 border-black text-black font-black uppercase px-6 py-3 h-auto hover:bg-[#E6E600] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 pb-10 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-[7fr_1fr] gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black leading-none">
                  AI-Powered
                  <br />
                  <span className="text-[#FF3F3F]">Codebase</span>
                  <br />
                  Exploration
                </h1>
                <p className="text-xl md:text-2xl font-bold text-black leading-relaxed max-w-lg">
                  Upload your code and unlock insights through search, chat, summarize, and visualize.
                  <span className="text-[#00FF88]"> Transform how you understand code.</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="bg-[#FF3F3F] border-4 border-black text-white font-black uppercase text-lg px-8 py-4 h-auto hover:bg-[#E03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[6px_6px_0px_#000000] hover:shadow-[3px_3px_0px_#000000]"
                >
                  <Upload className="w-6 h-6 mr-2" />
                  Upload Your Codebase
                </Button>
                <Button
                  className="bg-white border-4 border-black text-black font-black uppercase text-lg px-8 py-4 h-auto hover:bg-[#F0F0F0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[6px_6px_0px_#000000] hover:shadow-[3px_3px_0px_#000000]"
                >
                  Watch Demo
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-black">10K+</div>
                  <div className="text-sm font-bold text-black uppercase">Codebases Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-black">50+</div>
                  <div className="text-sm font-bold text-black uppercase">Languages Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-black">99%</div>
                  <div className="text-sm font-bold text-black uppercase">Accuracy Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative w-64 h-40 flex items-center justify-center">
              <video
                src="/landf.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover border-4 border-black shadow-[5px_4px_0px_#000000]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-10 pb-10 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black mb-4 tracking-tight">
              Four Powerful Modes
            </h2>
            <p className="text-xl font-bold text-black max-w-2xl mx-auto">
              Each mode is designed to give you different insights into your codebase
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Search Mode */}
            <div className="bg-[#00FF88] border-4 border-black p-8 shadow-[8px_8px_0px_#000000] hover:transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#FF3F3F] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-black text-[#00FF88] border-4 border-black flex items-center justify-center mr-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase text-black">Search</h3>
              </div>
              <p className="text-lg font-bold text-black mb-6 leading-relaxed">
                Find relevant code snippets instantly with semantic search. No more digging through files manually.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Semantic code understanding
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Function-level precision
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Multi-language support
                </li>
              </ul>
            </div>

            {/* Chat Mode */}
            <div className="bg-[#FFFF00] border-4 border-black p-8 shadow-[8px_8px_0px_#000000] hover:transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#FF3F3F] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-black text-[#FFFF00] border-4 border-black flex items-center justify-center mr-4">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase text-black">Chat</h3>
              </div>
              <p className="text-lg font-bold text-black mb-6 leading-relaxed">
                Interact with your codebase conversationally. Ask questions and get intelligent answers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Natural language queries
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Context-aware responses
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Code explanations
                </li>
              </ul>
            </div>

            {/* Summarize Mode */}
            <div className="bg-[#FFB3BA] border-4 border-black p-8 shadow-[8px_8px_0px_#000000] hover:transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#FF3F3F] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-black text-[#FFB3BA] border-4 border-black flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase text-black">Summarize</h3>
              </div>
              <p className="text-lg font-bold text-black mb-6 leading-relaxed">
                Generate concise summaries of your code files and understand complex logic quickly.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  File-level summaries
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Function documentation
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Complexity analysis
                </li>
              </ul>
            </div>

            {/* Visualize Mode */}
            <div className="bg-[#E6E6FA] border-4 border-black p-8 shadow-[8px_8px_0px_#000000] hover:transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#FF3F3F] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-black text-[#E6E6FA] border-4 border-black flex items-center justify-center mr-4">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase text-black">Visualize</h3>
              </div>
              <p className="text-lg font-bold text-black mb-6 leading-relaxed">
                Understand code structure through visual representations and dependency graphs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Dependency mapping
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Interactive graphs
                </li>
                <li className="flex items-center text-black font-bold">
                  <Check className="w-5 h-5 mr-2" />
                  Architecture overview
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pt-10 pb-10 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl font-bold text-black max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-[#FF3F3F] border-4 border-black w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_#000000]">
                <span className="text-4xl font-black text-white">1</span>
              </div>
              <h3 className="text-2xl font-black uppercase text-black mb-4">Upload Codebase</h3>
              <p className="text-lg font-bold text-black leading-relaxed">
                Upload your .zip file containing your codebase. We support all major programming languages.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-[#FFFF00] border-4 border-black w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_#000000]">
                <span className="text-4xl font-black text-black">2</span>
              </div>
              <h3 className="text-2xl font-black uppercase text-black mb-4">AI Processing</h3>
              <p className="text-lg font-bold text-black leading-relaxed">
                Our AI analyzes your code structure, dependencies, and creates semantic embeddings for search.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-[#00FF88] border-4 border-black w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_#000000]">
                <span className="text-4xl font-black text-black">3</span>
              </div>
              <h3 className="text-2xl font-black uppercase text-black mb-4">Explore & Discover</h3>
              <p className="text-lg font-bold text-black leading-relaxed">
                Use any of the four modes to explore your codebase and gain new insights instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="pt-10 pb-10 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black mb-4 tracking-tight">
              Loved by Developers
            </h2>
            <p className="text-xl font-bold text-black max-w-2xl mx-auto">
              See what developers are saying about Snipiq
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#FFFF00] border-4 border-black p-8 shadow-[8px_8px_0px_#000000]">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-black fill-black" />
                ))}
              </div>
              <p className="text-lg font-bold text-black mb-6 leading-relaxed">
                "Snipiq completely changed how I navigate large codebases. The semantic search is incredibly accurate!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black text-[#FFFF00] border-2 border-black flex items-center justify-center mr-4 font-black">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-black">Jane Smith</div>
                  <div className="font-bold text-black text-sm">Senior Developer at TechCorp</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#FFB3BA] border-4 border-black p-8 shadow-[8px_8px_0px_#000000]">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-black fill-black" />
                ))}
              </div>
              <p className="text-lg font-bold text-black mb-6 leading-relaxed">
                "The chat feature is like having a senior developer explain the codebase to you. Absolutely brilliant!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black text-[#FFB3BA] border-2 border-black flex items-center justify-center mr-4 font-black">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-black">Mike Davis</div>
                  <div className="font-bold text-black text-sm">Lead Engineer at StartupXYZ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center bg-white border-4 border-black p-6 shadow-[4px_4px_0px_#000000]">
              <Users className="w-8 h-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-black text-black">5,000+</div>
              <div className="text-sm font-bold text-black uppercase">Active Users</div>
            </div>
            <div className="text-center bg-white border-4 border-black p-6 shadow-[4px_4px_0px_#000000]">
              <Zap className="w-8 h-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-black text-black">10M+</div>
              <div className="text-sm font-bold text-black uppercase">Queries Processed</div>
            </div>
            <div className="text-center bg-white border-4 border-black p-6 shadow-[4px_4px_0px_#000000]">
              <Shield className="w-8 h-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-black text-black">99.9%</div>
              <div className="text-sm font-bold text-black uppercase">Uptime</div>
            </div>
            <div className="text-center bg-white border-4 border-black p-6 shadow-[4px_4px_0px_#000000]">
              <Star className="w-8 h-8 text-black mx-auto mb-2" />
              <div className="text-2xl font-black text-black">4.9/5</div>
              <div className="text-sm font-bold text-black uppercase">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-10 pb-10 bg-black">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-6 tracking-tight">
            Ready to Explore
            <br />
            <span className="text-[#00FF88]">Your Codebase?</span>
          </h2>
          <p className="text-xl font-bold text-white mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using Snipiq to understand their code better.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              onClick={handleGetStarted}
              className="bg-[#FF3F3F] border-4 border-white text-white font-black uppercase text-xl px-10 py-5 h-auto hover:bg-[#E03535] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[6px_6px_0px_#FFFFFF] hover:shadow-[3px_3px_0px_#FFFFFF]"
            >
              <Upload className="w-6 h-6 mr-2" />
              Start Exploring Now
            </Button>
            <span className="text-white font-bold">or</span>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-4 border-white text-black font-bold px-4 py-3 h-auto placeholder:text-black placeholder:opacity-60 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#FFFF00] uppercase font-mono"
              />
              <Button
                type="submit"
                className="bg-[#FFFF00] border-4 border-white text-black font-black uppercase px-6 py-3 h-auto hover:bg-[#E6E600] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_#FFFFFF]"
              >
                Notify Me
              </Button>
            </form>
          </div>

          <p className="text-sm font-bold text-white opacity-70 uppercase">
            Free to try • No credit card required • 100% secure
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t-4 border-black pt-6 pb-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#FFFF00] border-4 border-black flex items-center justify-center mr-3">
                  <span className="text-black font-black text-xl">S</span>
                </div>
                <span className="text-2xl font-black uppercase tracking-tight font-mono text-black">
                  Snipiq
                </span>
              </div>
              <p className="text-black font-bold leading-relaxed mb-4">
                AI-powered semantic code search and exploration platform. Transform how you understand and navigate your codebase.
              </p>
              <div className="text-sm font-bold text-black uppercase">
                Built with ❤️ by developers, for developers
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-black uppercase text-black mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">Features</a></li>
                <li><a href="#how-it-works" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">How it works</a></li>
                <li><a href="/plans" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">Pricing</a></li>
                <li><a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">API Docs</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-black uppercase text-black mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">About</a></li>
                <li><a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">Blog</a></li>
                <li><a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">Careers</a></li>
                <li><a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t-4 border-black mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-black font-bold text-sm uppercase mb-4 md:mb-0">
              © 2024 Snipiq. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm font-bold text-black uppercase">
              <a href="#" className="hover:text-[#FF3F3F] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#FF3F3F] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#FF3F3F] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
