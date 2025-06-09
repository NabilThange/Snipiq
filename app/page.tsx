  "use client"

  import type React from "react"
  import { useState } from "react"
  import { useRouter } from "next/navigation"
  import { Search, FileText, MessageCircle, BarChart3, Upload, Check, Star, Users, Zap, Shield } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import Header from "@/components/header"

  export default function LandingPage() {
    const [email, setEmail] = useState("")
    const router = useRouter()

    const handleGetStarted = () => {
      // Navigate to app page
      router.push("/app")
    }

    const handleEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Handle email signup
      console.log("Email signup:", email)
    }

    return (
      <div className="min-h-screen bg-white font-bold">
        <Header />

        {/* Add padding to account for fixed header */}
        <div className="pt-24">
          {/* Hero Section - Exact Copy of Reference */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 max-w-7xl ">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left Column - Content */}
                <div className="space-y-8 ml-[70px]">
                  {/* Main Headline */}
                  <h1 className="text-6xl md:text-7xl font-black text-black leading-tight tracking-tight">
                    Explore code
                    <br />
                    across the world
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl text-black font-normal leading-relaxed max-w-lg">
                    An AI-powered platform to understand great codebases around the globe, build yours now
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleGetStarted}
                      className="bg-white border-4 border-black text-black font-black uppercase px-8 py-4 h-auto hover:bg-[#e0e0e0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]"
                    >
                      Get started today
                    </Button>
                    <Button className="bg-[#FFFF00] border-4 border-black text-black font-black uppercase px-8 py-4 h-auto hover:bg-[#E6E600] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]">
                      Our plans
                    </Button>
                  </div>
                </div>

                {/* Right Column - Illustration */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
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

              {/* Bottom Cards Section */}
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-16">
                {/* Left Card - Community Insights */}
                <div className="bg-[#FFB3BA] border-4 border-black p-6 md:p-8 lg:p-8 rounded-xl h-[280px] md:h-[300px] lg:h-[320px] flex flex-col">
                  <div className="flex flex-col items-center text-center flex-1">
                    {/* Centered Illustration */}
                    <div className="flex-shrink-0 mb-4">
                      <img
                        src="/blue1.png"
                        alt="Community illustration"
                        className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-black mb-3 md:mb-4">Code insights</h3>
                        <p className="text-black font-normal leading-relaxed text-sm md:text-base">
                          All code analysis done through our platform is highly secure and fully private, we care about
                          your privacy!
                        </p>
                      </div>
                      {/* <div className="mt-4">
                        <a href="#" className="text-black font-bold underline hover:no-underline text-sm md:text-base">
                          Check the features
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Right Card - Free Live Support */}
                <div className="bg-[#FFFF00] border-4 border-black p-6 md:p-8 lg:p-8 rounded-xl h-[280px] md:h-[300px] lg:h-[320px] flex flex-col">
                  <div className="flex flex-col items-center text-center flex-1">
                    {/* Centered Illustration */}
                    <div className="flex-shrink-0 mb-4">
                      <img
                        src="/ai.png"
                        alt="Support team illustration"
                        className="w-[86px] h-20 md:w-[102px] md:h-24 lg:w-[118px] lg:h-28 mx-auto"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-black mb-3 md:mb-4">AI-Powered Code Learning</h3>
                        <p className="text-black font-normal leading-relaxed text-sm md:text-base">
                          Master any codebase faster than ever! Snipiq's AI assistant breaks down complex code, teaches you step by step, and helps you build with confidence — no matter your experience level.
                        </p>
                      </div>
                      {/* <div className="mt-4">
                        <a href="#" className="text-black font-bold underline hover:no-underline text-sm md:text-base">
                          Learn more about Snipiq
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-[#F5F5F5]">
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
          <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black uppercase text-black mb-4 tracking-tight">How It Works</h2>
                <p className="text-xl font-bold text-black max-w-2xl mx-auto">Get started in three simple steps</p>
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
          <section id="testimonials" className="py-20 bg-[#F5F5F5]">
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
                    "Snipiq completely changed how I navigate large codebases. The semantic search is incredibly
                    accurate!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black text-[#FFFF00] border-2 border-black flex items-center justify-center mr-4 font-black">
                      JS
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
                    "The chat feature is like having a senior developer explain the codebase to you. Absolutely
                    brilliant!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black text-[#FFB3BA] border-2 border-black flex items-center justify-center mr-4 font-black">
                      MD
                    </div>
                    <div>
                      <div className="font-black text-black">Mike Davis</div>
                      <div className="font-bold text-black text-sm">Lead Engineer at StartupXYZ</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
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
          <section className="py-20 bg-black">
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
          <footer id="contact" className="bg-white border-t-4 border-black py-12">
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
                    AI-powered semantic code search and exploration platform. Transform how you understand and navigate
                    your codebase.
                  </p>
                  <div className="text-sm font-bold text-black uppercase">Built with ❤️ by developers, for developers</div>
                </div>

                {/* Product Links */}
                <div>
                  <h3 className="font-black uppercase text-black mb-4">Product</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#features"
                        className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#how-it-works"
                        className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase"
                      >
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">
                        API Docs
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h3 className="font-black uppercase text-black mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="font-bold text-black hover:text-[#FF3F3F] transition-colors uppercase">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t-4 border-black mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-black font-bold text-sm uppercase mb-4 md:mb-0">
                  © 2024 Snipiq. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 text-sm font-bold text-black uppercase">
                  <a href="#" className="hover:text-[#FF3F3F] transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-[#FF3F3F] transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="hover:text-[#FF3F3F] transition-colors">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }
