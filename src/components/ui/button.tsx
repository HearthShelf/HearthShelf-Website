import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'hs-btn',
  {
    variants: {
      variant: {
        primary: 'hs-btn-primary',
        pill: 'hs-btn-pill',
      },
      size: {
        sm: 'hs-btn-sm',
        lg: 'hs-btn-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  },
)

export interface ButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * The marketing buttons are always links, so this renders an <a>. Styling lives
 * in landing.css (.hs-btn*), shared with the original design.
 */
export const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'

export { buttonVariants }
