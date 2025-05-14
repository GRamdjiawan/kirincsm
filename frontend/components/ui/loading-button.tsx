"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { LoadingAnimation } from "./loading-animation"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { children, className, isLoading = false, loadingText, variant = "default", size = "default", disabled, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        className={cn(className)}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingAnimation size="small" color="gradient" />
            {loadingText || children}
          </div>
        ) : (
          children
        )}
      </Button>
    )
  },
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
