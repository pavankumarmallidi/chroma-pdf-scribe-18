
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
      variant: {
        default: "bg-primary/20",
        gradient: "bg-gradient-to-r from-violet-200/20 to-purple-200/20",
        glass: "glass",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        gradient: "bg-gradient-to-r from-violet-500 to-purple-500",
        glow: "bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/50",
        animated: "bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 bg-size-200 animate-gradient",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface EnhancedProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>["variant"];
  showPercentage?: boolean;
  label?: string;
}

const EnhancedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  EnhancedProgressProps
>(({ className, value, size, variant, indicatorVariant = "default", showPercentage, label, ...props }, ref) => (
  <div className="w-full space-y-2">
    {(label || showPercentage) && (
      <div className="flex justify-between items-center text-sm">
        {label && <span className="text-muted-foreground">{label}</span>}
        {showPercentage && (
          <span className="text-muted-foreground font-medium">
            {Math.round(value || 0)}%
          </span>
        )}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ size, variant }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(progressIndicatorVariants({ variant: indicatorVariant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
));

EnhancedProgress.displayName = ProgressPrimitive.Root.displayName;

export { EnhancedProgress };
