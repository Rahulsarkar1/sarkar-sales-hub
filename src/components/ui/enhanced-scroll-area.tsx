import * as React from "react"
import { ScrollArea } from "./scroll-area"
import { cn } from "@/lib/utils"

interface EnhancedScrollAreaProps extends React.ComponentProps<typeof ScrollArea> {
  children: React.ReactNode
  className?: string
}

export const EnhancedScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  EnhancedScrollAreaProps
>(({ className, children, ...props }, ref) => {
  const [scrollPosition, setScrollPosition] = React.useState({ top: 0, bottom: 0 })
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [bounceDirection, setBounceDirection] = React.useState<'top' | 'bottom' | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight
    const clientHeight = element.clientHeight
    
    const maxScroll = scrollHeight - clientHeight
    const scrollBottom = maxScroll - scrollTop

    setScrollPosition({ top: scrollTop, bottom: scrollBottom })
    setIsScrolling(true)

    // Detect bounce at boundaries
    if (scrollTop <= 0 && bounceDirection !== 'top') {
      setBounceDirection('top')
    } else if (scrollBottom <= 0 && bounceDirection !== 'bottom') {
      setBounceDirection('bottom')
    } else if (scrollTop > 5 && scrollBottom > 5) {
      setBounceDirection(null)
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set scrolling to false after scroll ends
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
      setBounceDirection(null)
    }, 150)
  }, [bounceDirection])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const showTopGradient = scrollPosition.top > 20
  const showBottomGradient = scrollPosition.bottom > 20

  return (
    <div className="relative overflow-hidden">
      {/* Top gradient fade */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none transition-opacity duration-300",
          "bg-gradient-to-b from-blue-500/10 via-blue-400/5 to-transparent",
          showTopGradient ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: showTopGradient 
            ? "linear-gradient(to bottom, hsl(217 91% 60% / 0.1), hsl(217 91% 60% / 0.05), transparent)"
            : "transparent"
        }}
      />

      {/* Bottom gradient fade */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none transition-opacity duration-300",
          "bg-gradient-to-t from-blue-500/10 via-blue-400/5 to-transparent",
          showBottomGradient ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: showBottomGradient 
            ? "linear-gradient(to top, hsl(217 91% 60% / 0.1), hsl(217 91% 60% / 0.05), transparent)"
            : "transparent"
        }}
      />

      {/* Enhanced scroll area with bounce effect */}
      <ScrollArea
        ref={ref}
        className={cn(
          "w-full transition-transform duration-150 ease-out",
          bounceDirection === 'top' && "animate-bounce-top",
          bounceDirection === 'bottom' && "animate-bounce-bottom",
          className
        )}
        {...props}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto overscroll-y-contain"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="px-1">
            {children}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})

EnhancedScrollArea.displayName = "EnhancedScrollArea"