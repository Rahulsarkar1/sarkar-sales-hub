import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:bg-destructive/50 disabled:text-destructive-foreground/50",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:border-input/50 disabled:text-foreground/50 dark:border-border dark:hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-secondary/50 disabled:text-secondary-foreground/50 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground disabled:text-foreground/50 dark:hover:bg-secondary/80",
        link: "text-primary underline-offset-4 hover:underline disabled:text-primary/50",
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm disabled:bg-primary/50 disabled:text-primary-foreground/50",
        glass:
          "bg-background/60 backdrop-blur border-2 border-border text-foreground hover:bg-background/80 disabled:bg-background/30 disabled:text-foreground/50 dark:bg-card/80 dark:hover:bg-card/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
