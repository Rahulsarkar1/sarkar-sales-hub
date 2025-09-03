import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

interface EnhancedScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  children: React.ReactNode
  className?: string
}

export const EnhancedScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  EnhancedScrollAreaProps
>(({ className, children, ...props }, ref) => {
  const [scrollPosition, setScrollPosition] = React.useState({ top: 0, bottom: 0 })
  const [bounceDirection, setBounceDirection] = React.useState<'top' | 'bottom' | null>(null)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleScroll = React.useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const scrollTop = viewport.scrollTop
    const scrollHeight = viewport.scrollHeight
    const clientHeight = viewport.clientHeight
    
    const maxScroll = scrollHeight - clientHeight
    const scrollBottom = maxScroll - scrollTop

    setScrollPosition({ top: scrollTop, bottom: scrollBottom })

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

    // Reset bounce after animation
    timeoutRef.current = setTimeout(() => {
      setBounceDirection(null)
    }, 300)
  }, [bounceDirection])

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleScroll])

  const showTopGradient = scrollPosition.top > 20
  const showBottomGradient = scrollPosition.bottom > 20

  return (
    <div className="relative">
      {/* Top gradient fade */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none transition-opacity duration-300",
          showTopGradient ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(to bottom, hsl(var(--primary) / 0.08), transparent)"
        }}
      />

      {/* Bottom gradient fade */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none transition-opacity duration-300",
          showBottomGradient ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(to top, hsl(var(--primary) / 0.08), transparent)"
        }}
      />

      {/* Enhanced scroll area with bounce effect */}
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-transform duration-200 ease-out",
          bounceDirection === 'top' && "animate-bounce-top",
          bounceDirection === 'bottom' && "animate-bounce-bottom",
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport 
          ref={viewportRef}
          className="h-full w-full rounded-[inherit]"
          style={{
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.ScrollAreaScrollbar
          className="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]"
          orientation="vertical"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </div>
  )
})

EnhancedScrollArea.displayName = "EnhancedScrollArea"