import * as React from 'react'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  children: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-card border-border text-foreground',
      success: 'bg-green-50 dark:bg-green-950 border-green-600 text-green-900 dark:text-green-100',
      warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-600 text-yellow-900 dark:text-yellow-100',
      destructive: 'bg-destructive/10 border-destructive text-destructive',
    }
    
    return (
      <div
        ref={ref}
        className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}
        role="alert"
        {...props}
      >
        {children}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={`mb-1 font-semibold leading-none tracking-tight ${className}`}
        {...props}
      >
        {children}
      </h5>
    )
  }
)

AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-sm [&_p]:leading-relaxed ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
