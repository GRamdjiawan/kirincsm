"use client"

import type React from "react"

import { useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSectionContext } from "../section-context"
import type { CarouselContent } from "../section-types"

export function CarouselPreview() {
  const {
    selectedSection,
    activeCarouselSlide,
    setActiveCarouselSlide,
    carouselDirection,
    setCarouselDirection,
    isCarouselAnimating,
    setIsCarouselAnimating,
    isSwiping,
    setIsSwiping,
    touchStartX,
    touchEndX,
    touchStartY,
    touchEndY,
  } = useSectionContext()

  const handleNextSlideRef = useRef<null | (() => void)>(null)
  const handlePrevSlideRef = useRef<null | (() => void)>(null)

  if (!selectedSection || selectedSection.type !== "CAROUSEL") return null

  const content = selectedSection.content as CarouselContent

  if (content.slides.length === 0) {
    return (
      <div className="p-3 sm:p-4 text-center text-gray-400">
        <p>No slides added yet</p>
      </div>
    )
  }

  const currentSlide = content.slides[activeCarouselSlide % content.slides.length]

  // Carousel navigation
  const handleNextSlide = useCallback(() => {
    if (isCarouselAnimating) return

    setCarouselDirection(1)
    setActiveCarouselSlide((prevIndex) => (prevIndex + 1) % content.slides.length)
  }, [isCarouselAnimating, content.slides.length, setCarouselDirection, setActiveCarouselSlide])

  const handlePrevSlide = useCallback(() => {
    if (isCarouselAnimating) return

    setCarouselDirection(-1)
    setActiveCarouselSlide((prevIndex) => (prevIndex - 1 + content.slides.length) % content.slides.length)
  }, [isCarouselAnimating, content.slides.length, setCarouselDirection, setActiveCarouselSlide])

  handleNextSlideRef.current = handleNextSlide
  handlePrevSlideRef.current = handlePrevSlide

  const handleDotClick = useCallback(
    (index: number) => {
      if (index === activeCarouselSlide || isCarouselAnimating) return

      setCarouselDirection(index > activeCarouselSlide ? 1 : -1)
      setActiveCarouselSlide(index)
    },
    [activeCarouselSlide, isCarouselAnimating, setCarouselDirection, setActiveCarouselSlide],
  )

  // Touch handlers for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY

    const xDiff = touchStartX.current - touchEndX.current
    const yDiff = touchStartY.current - touchEndY.current

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 10) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return

    const xDiff = touchStartX.current - touchEndX.current
    const yDiff = touchStartY.current - touchEndY.current

    setIsSwiping(false)

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
      if (xDiff > 0) {
        handleNextSlideRef.current?.()
      } else {
        handlePrevSlideRef.current?.()
      }
    }

    touchStartX.current = 0
    touchEndX.current = 0
    touchStartY.current = 0
    touchEndY.current = 0
  }

  // Autoplay
  useEffect(() => {
    if (!content.autoplay) return

    const interval = setInterval(() => {
      if (!isSwiping && !isCarouselAnimating) {
        handleNextSlideRef.current?.()
      }
    }, content.interval)

    return () => clearInterval(interval)
  }, [content.autoplay, content.interval, isSwiping, isCarouselAnimating])

  // Get height based on setting
  const getHeightClass = () => {
    switch (content.height) {
      case "small":
        return "h-[300px] sm:h-[350px] md:h-[400px]"
      case "large":
        return "h-[500px] sm:h-[600px] md:h-[700px]"
      case "medium":
      default:
        return "h-[400px] sm:h-[500px] md:h-[600px]"
    }
  }

  // Get image height based on caption style
  const getImageHeightClass = () => {
    if (content.captionStyle === "below") {
      return "h-[200px] sm:h-[300px] md:h-[400px]"
    }
    return "h-[250px] sm:h-[350px] md:h-[450px]"
  }

  return (
    <div className="relative overflow-hidden max-w-5xl mx-auto">
      <div
        className={`relative w-full ${getHeightClass()}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence
          initial={false}
          custom={carouselDirection}
          onExitComplete={() => setIsCarouselAnimating(false)}
        >
          <motion.div
            key={activeCarouselSlide}
            custom={carouselDirection}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? "100%" : "-100%",
                opacity: 0,
              }),
              center: { x: 0, opacity: 1 },
              exit: (direction: number) => ({
                x: direction > 0 ? "-100%" : "100%",
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute inset-0 flex flex-col"
            onAnimationStart={() => setIsCarouselAnimating(true)}
          >
            <div
              className={`${content.clickAction === "none" ? "cursor-default" : "cursor-pointer"} w-full h-full flex flex-col`}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if (!isSwiping && content.clickAction === "link" && currentSlide.url) {
                  e.stopPropagation()
                  // In a real implementation, this would navigate to the URL
                  console.log(`Navigating to: ${currentSlide.url}`)
                }
              }}
            >
              <div className={`relative w-full ${getImageHeightClass()} shadow-md`}>
                {currentSlide.imageUrl ? (
                  <img
                    src={currentSlide.imageUrl || "/placeholder.svg"}
                    alt={currentSlide.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/10">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}

                {content.captionStyle === "overlay" && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-white">
                      {currentSlide.caption}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80">{currentSlide.subtitle}</p>
                  </div>
                )}
              </div>

              {content.captionStyle === "white-box" && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-white">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-center">
                    {currentSlide.caption}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center">{currentSlide.subtitle}</p>
                </div>
              )}

              {content.captionStyle === "below" && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-center">
                    {currentSlide.caption}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 text-center">{currentSlide.subtitle}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {content.showArrows && (
        <>
          <button
            className="hidden sm:block absolute left-4 top-[175px] md:top-[225px] -translate-y-1/2 z-50 bg-white/70 hover:bg-white p-3 rounded-full shadow-md transition-all duration-200"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <button
            className="hidden sm:block absolute right-4 top-[175px] md:top-[225px] -translate-y-1/2 z-50 bg-white/70 hover:bg-white p-3 rounded-full shadow-md transition-all duration-200"
            onClick={handleNextSlide}
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {content.showDots && (
        <div className="flex justify-center mt-2 sm:mt-4">
          {content.slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDotClick(index)
              }}
              className={cn(
                "h-2 mx-1 rounded-full transition-all duration-300",
                index === activeCarouselSlide ? "bg-black w-4 sm:w-6" : "bg-gray-300 w-2 hover:bg-gray-400",
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeCarouselSlide ? "true" : "false"}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}
