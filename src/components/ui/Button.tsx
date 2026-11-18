import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-block font-[Inter] font-semibold uppercase tracking-[1] rounded-[6px] border-none cursor-pointer text-white transition-[background,transform] duration-250 ease-out hover:-translate-y-[2px] focus-visible:outline-[2px] focus-visible:outline-offset-[3px] focus-visible:outline-fg',
  {
    variants: {
      variant: {
        accent:
          'bg-accent shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:bg-accent-hover',
        outline:
          'border border-white/16 bg-white/2 text-fg hover:border-accent/50 hover:bg-accent/6 hover:text-fg',
        gradient:
          'bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-accent-text-bg shadow-[0_10px_28px_rgba(var(--accent-rgb,245,158,11),0.28)] hover:shadow-[0_14px_30px_rgba(var(--accent-rgb,245,158,11),0.3)]',
      },
      size: {
        sm: 'px-[22px] py-[12px] text-[14px]',
        md: 'px-[32px] py-[14px] text-[16px]',
        lg: 'px-[40px] py-[16px] text-[16px]',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'md',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>(
  ({ className, variant, size, asChild, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<
        any,
        any
      >;
      return React.cloneElement(child, {
        className: cn(
          classes,
          (child.props as { className?: string }).className
        ),
        ...props,
      });
    }

    if (href) {
      return (
        <a
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
