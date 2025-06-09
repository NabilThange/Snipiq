"use client"

import { Check, Github, Linkedin, Zap, Star, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Link from "next/link"

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-white font-bold">
      <Header />

      {/* Add padding to account for fixed header */}
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[#FFFF00] via-[#00FF88] to-[#FF3F3F] relative overflow-hidden">
          {/* Geometric Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-8 border-black transform rotate-45"></div>
            <div className="absolute top-32 right-20 w-24 h-24 bg-black transform rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 border-8 border-black rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-28 h-28 bg-black transform -rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 border-8 border-black transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>

          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center">
              <div className="inline-block bg-black text-[#00FF88] px-6 py-3 border-4 border-black shadow-[8px_8px_0px_#FFFFFF] mb-8 transform -rotate-2">
                <span className="font-black uppercase text-lg tracking-wider">🚀 PRICING PLANS</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-black leading-none mb-6 tracking-tight">
                SIMPLE.
                <br />
                <span className="text-white text-stroke-black">POWERFUL.</span>
                <br />
                <span className="bg-black text-[#FFFF00] px-4 inline-block transform rotate-1">FREE.</span>
              </h1>

              <p className="text-2xl font-bold text-black max-w-2xl mx-auto leading-tight">
                No hidden costs, no premium tiers, no BS.
                <span className="bg-[#FF3F3F] text-white px-2 py-1 mx-2 transform -rotate-1 inline-block">
                  JUST PURE AI POWER
                </span>
                for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Hackathon & Creator Section - MOVED TO SECOND POSITION */}
        <section className="py-16 bg-black text-white relative overflow-hidden">
          {/* Geometric background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-24 h-24 border-4 border-white transform rotate-45"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white transform rotate-12"></div>
          </div>

          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <div className="bg-[#00FF88] text-black px-6 py-3 border-4 border-white shadow-[6px_6px_0px_#FFFFFF] inline-block mb-6 transform rotate-2">
                <span className="font-black uppercase text-lg">🏆 HACKATHON PROJECT</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight">
                Made during
                <br />
                <span className="bg-[#FF3F3F] text-white px-4 py-2 inline-block transform -rotate-1">
                  TRAE AI IDE: ZERO LIMITS
                </span>
                <br />
                Hackathon
              </h2>
            </div>

            {/* Creator Section */}
            <div className="bg-white text-black border-6 border-white p-8 shadow-[12px_12px_0px_#FFFF00] max-w-2xl mx-auto transform -rotate-1">
              <div className="text-center">
                <div className="bg-black text-white w-20 h-20 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl">
                  NT
                </div>

                <h3 className="text-3xl font-black uppercase mb-2">NABIL THANGE</h3>
                <p className="font-bold text-lg mb-6">Full-Stack Developer & AI Enthusiast</p>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a
                    href="https://github.com/nabilthange"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white border-4 border-black px-6 py-3 font-black uppercase hover:bg-[#333] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] flex items-center"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GITHUB
                  </a>

                  <a
                    href="https://linkedin.com/in/nabilthange"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0077B5] text-white border-4 border-black px-6 py-3 font-black uppercase hover:bg-[#005885] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] flex items-center"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LINKEDIN
                  </a>
                </div>
              </div>
            </div>

            {/* Hackathon Badge */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-[#FFFF00] via-[#00FF88] to-[#FF3F3F] p-1 border-4 border-white shadow-[8px_8px_0px_#FFFFFF] transform rotate-1">
                <div className="bg-black text-white px-8 py-4">
                  <div className="flex items-center justify-center">
                    <Star className="w-6 h-6 mr-3" />
                    <span className="font-black uppercase text-lg">ZERO LIMITS • INFINITE POSSIBILITIES</span>
                    <Star className="w-6 h-6 ml-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Plan Section */}
        <section className="py-20 bg-white relative">
          {/* Scattered geometric elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-16 h-16 bg-[#FFFF00] border-4 border-black transform rotate-45"></div>
            <div className="absolute top-40 right-20 w-12 h-12 bg-[#FF3F3F] border-4 border-black rounded-full"></div>
            <div className="absolute bottom-40 left-20 w-20 h-20 border-4 border-black transform rotate-12"></div>
            <div className="absolute bottom-20 right-40 w-14 h-14 bg-[#00FF88] border-4 border-black"></div>
          </div>

          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            {/* Free Plan Card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border-8 border-black shadow-[16px_16px_0px_#00FF88] transform hover:-translate-y-2 hover:shadow-[20px_20px_0px_#FF3F3F] transition-all duration-300 relative overflow-hidden">
                {/* Plan Header */}
                <div className="bg-[#FFFF00] border-b-8 border-black p-8 relative">
                  <div className="absolute top-4 right-4">
                    <div className="bg-black text-[#FFFF00] px-3 py-1 font-black text-xs uppercase transform rotate-12">
                      BEST VALUE
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <Crown className="w-12 h-12 text-black mr-4" />
                    <h2 className="text-4xl font-black uppercase text-black tracking-tight">FREE PLAN</h2>
                  </div>

                  <div className="text-center">
                    <div className="text-8xl font-black text-black mb-2">$0</div>
                    <div className="bg-black text-[#FFFF00] px-4 py-2 inline-block font-black uppercase text-lg">
                      FOREVER FREE
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-8">
                  <h3 className="text-2xl font-black uppercase text-black mb-6 text-center">🎯 EVERYTHING INCLUDED</h3>

                  <div className="space-y-4">
                    {[
                      "Unlimited Codebase Uploads",
                      "AI-Powered Semantic Search",
                      "Interactive Chat with Your Code",
                      "Automatic Code Summarization",
                      "Visual Dependency Mapping",
                      "Build & Setup Guides",
                      "Multi-Language Support",
                      "Real-time Code Analysis",
                      "Export & Share Features",
                      "Community Support",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-[#00FF88] border-4 border-black w-8 h-8 flex items-center justify-center mr-4 transform rotate-45">
                          <Check className="w-4 h-4 text-black transform -rotate-45" />
                        </div>
                        <span className="font-bold text-black text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 text-center">
                    <Link href="/app">
                      <Button className="bg-[#FF3F3F] border-6 border-black text-white font-black uppercase text-xl px-12 py-6 h-auto hover:bg-[#E03535] hover:transform hover:translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] transform hover:scale-105">
                        <Zap className="w-6 h-6 mr-3" />
                        START EXPLORING NOW
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Free Section */}
            <div className="mt-16 text-center">
              <div className="bg-black text-white p-8 border-8 border-black shadow-[12px_12px_0px_#FFFF00] max-w-3xl mx-auto transform -rotate-1">
                <h3 className="text-3xl font-black uppercase mb-4">
                  <Sparkles className="w-8 h-8 inline mr-3" />
                  WHY IS IT FREE?
                </h3>
                <p className="text-xl font-bold leading-relaxed">
                  We believe powerful AI tools should be accessible to EVERYONE. No paywalls, no limits, no corporate
                  BS. Just pure innovation built by developers, for developers. 🚀
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built With Section */}
        <section className="py-16 bg-[#F5F5F5] border-t-8 border-black">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black uppercase text-black mb-6 tracking-tight">
                BUILT WITH CUTTING-EDGE TECH
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Trae IDE */}
              <div className="bg-white border-6 border-black p-6 shadow-[8px_8px_0px_#FF3F3F] transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#00FF88] transition-all duration-300">
                <div className="text-center">
                  <div className="bg-[#FF3F3F] text-white w-16 h-16 border-4 border-black flex items-center justify-center mx-auto mb-4 font-black text-2xl transform rotate-12">
                    T
                  </div>
                  <h3 className="text-xl font-black uppercase text-black mb-2">TRAE IDE</h3>
                  <p className="font-bold text-black text-sm">AI-Powered Development Environment</p>
                </div>
              </div>

              {/* Novita.AI */}
              <div className="bg-white border-6 border-black p-6 shadow-[8px_8px_0px_#00FF88] transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#FFFF00] transition-all duration-300">
                <div className="text-center">
                  <div className="bg-[#00FF88] text-black w-16 h-16 border-4 border-black flex items-center justify-center mx-auto mb-4 font-black text-2xl transform -rotate-12">
                    N
                  </div>
                  <h3 className="text-xl font-black uppercase text-black mb-2">NOVITA.AI</h3>
                  <p className="font-bold text-black text-sm">Advanced AI Model Infrastructure</p>
                </div>
              </div>

              {/* Zilliz */}
              <div className="bg-white border-6 border-black p-6 shadow-[8px_8px_0px_#FFFF00] transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_#FF3F3F] transition-all duration-300">
                <div className="text-center">
                  <div className="bg-[#FFFF00] text-black w-16 h-16 border-4 border-black flex items-center justify-center mx-auto mb-4 font-black text-2xl transform rotate-45">
                    Z
                  </div>
                  <h3 className="text-xl font-black uppercase text-black mb-2">ZILLIZ</h3>
                  <p className="font-bold text-black text-sm">Vector Database & Search Engine</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-[#00FF88] to-[#FFFF00] border-t-8 border-black">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-5xl font-black uppercase text-black mb-6 leading-tight">
              READY TO EXPLORE
              <br />
              YOUR CODEBASE?
            </h2>

            <p className="text-xl font-bold text-black mb-8 max-w-2xl mx-auto">
              Join the revolution. Start exploring your code like never before.
              <span className="bg-black text-[#00FF88] px-2 py-1 mx-2">100% FREE</span>
              forever.
            </p>

            <Link href="/app">
              <Button className="bg-black text-[#00FF88] border-6 border-black font-black uppercase text-2xl px-16 py-8 h-auto hover:bg-[#333] hover:transform hover:scale-110 transition-all duration-300 shadow-[12px_12px_0px_#000000] hover:shadow-[16px_16px_0px_#FF3F3F] transform hover:-translate-y-2">
                <Zap className="w-8 h-8 mr-4" />
                GET STARTED NOW
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
