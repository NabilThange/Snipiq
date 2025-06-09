"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useScrollDirection } from "@/hooks/use-scroll-direction"

export default function Header() {
  const { isVisible } = useScrollDirection()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Check if we're on the landing page
  const isLandingPage = pathname === "/"

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Minimal header for non-landing pages
  if (!isLandingPage) {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black py-3 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Snipiq Logo" width={32} height={32} className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-black uppercase tracking-tight font-mono text-black">SNIPIQ</h1>
                <p className="text-black font-bold text-xs">AI-POWERED SEMANTIC SEARCH</p>
              </div>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  // Full header for landing page
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black py-3 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-6">
              <Image src="/logo.png" alt="Snipiq Logo" width={48} height={48} className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight font-mono text-black">SNIPIQ</h1>
                <p className="text-black font-bold text-xs md:text-sm">AI-POWERED SEMANTIC SEARCH FOR YOUR CODEBASE.</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-10">
              <a
                href="#features"
                className="text-black font-bold uppercase hover:text-[#666666] transition-all duration-200 text-sm tracking-normal hover:font-black"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-black font-bold uppercase hover:text-[#666666] transition-all duration-200 text-sm tracking-normal hover:font-black"
              >
                How it works
              </a>
              <a
                href="#testimonials"
                className="text-black font-bold uppercase hover:text-[#666666] transition-all duration-200 text-sm tracking-normal hover:font-black"
              >
                Testimonials
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden bg-white border-4 border-black p-2 hover:bg-[#F0F0F0] hover:transform hover:translate-y-1 transition-all duration-300 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l-4 border-black z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 pt-24">
          {/* Mobile Navigation Links */}
          <nav className="space-y-6">
            <a
              href="#features"
              onClick={closeMobileMenu}
              className="block text-black font-black uppercase hover:text-[#666666] transition-all duration-200 text-lg tracking-normal border-b-2 border-black pb-3"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={closeMobileMenu}
              className="block text-black font-black uppercase hover:text-[#666666] transition-all duration-200 text-lg tracking-normal border-b-2 border-black pb-3"
            >
              How it works
            </a>
            <a
              href="#testimonials"
              onClick={closeMobileMenu}
              className="block text-black font-black uppercase hover:text-[#666666] transition-all duration-200 text-lg tracking-normal border-b-2 border-black pb-3"
            >
              Testimonials
            </a>
          </nav>
        </div>
      </div>
    </>
  )
}
