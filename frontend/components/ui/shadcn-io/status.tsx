"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        online: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        offline: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        maintenance: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        degraded: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        unavailable: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    },
    defaultVariants: {
      status: "online",
    },
  }
)

const indicatorVariants = cva(
  "relative flex h-2 w-2 rounded-full",
  {
    variants: {
      status: {
        online: "bg-green-600",
        offline: "bg-gray-600",
        maintenance: "bg-blue-600",
        degraded: "bg-orange-600",
        available: "bg-green-600",
        unavailable: "bg-gray-600",
        pending: "bg-yellow-600",
        approved: "bg-green-600",
        rejected: "bg-red-600",
        completed: "bg-green-600",
        cancelled: "bg-gray-600",
      },
    },
    defaultVariants: {
      status: "online",
    },
  }
)

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  status: NonNullable<VariantProps<typeof statusVariants>["status"]>
}

const StatusContext = React.createContext<{ status: StatusProps["status"] }>({
  status: "online",
})

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  ({ className, status, children, ...props }, ref) => {
    return (
      <StatusContext.Provider value={{ status }}>
        <div
          ref={ref}
          className={cn(statusVariants({ status }), className)}
          {...props}
        >
          {children}
        </div>
      </StatusContext.Provider>
    )
  }
)
Status.displayName = "Status"

const StatusIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }
>(({ className, animated = false, ...props }, ref) => {
  const { status } = React.useContext(StatusContext)
  
  return (
    <div
      ref={ref}
      className={cn(indicatorVariants({ status }), className)}
      {...props}
    >
      {animated && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" 
              style={{ backgroundColor: 'currentColor' }} />
      )}
    </div>
  )
})
StatusIndicator.displayName = "StatusIndicator"

const StatusLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  const { status } = React.useContext(StatusContext)
  
  return (
    <span ref={ref} className={cn("capitalize", className)} {...props}>
      {children || status}
    </span>
  )
})
StatusLabel.displayName = "StatusLabel"

export { Status, StatusIndicator, StatusLabel, statusVariants, indicatorVariants }
