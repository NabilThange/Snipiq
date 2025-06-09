"use client"

import { useState, useEffect } from "react"

interface ScrollDirection {
  isVisible: boolean
  scrollDirection: "up" | "down" | null
  scrollY: number
}

export function useScrollDirection(threshold = 10, topOffset = 100): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const [scrollY, setScrollY] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Always show navbar when near the top of the page
      if (currentScrollY < topOffset) {
        setIsVisible(true)
        setScrollDirection(null)
        ticking = false
        return
      }

      // Determine scroll direction and update visibility
      if (Math.abs(currentScrollY - lastScrollY) >= threshold) {
        const newScrollDirection = currentScrollY > lastScrollY ? "down" : "up"
        setScrollDirection(newScrollDirection)
        setIsVisible(newScrollDirection === "up")
        lastScrollY = currentScrollY
      }

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame for better performance
        window.requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", onScroll)

    // Clean up
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold, topOffset])

  return { isVisible, scrollDirection, scrollY }
}
