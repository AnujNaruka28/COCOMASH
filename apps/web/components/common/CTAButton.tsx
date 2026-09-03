import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CTAButtonVariant = "primary" | "secondary" | "destructive";

interface CTAButtonProps {
  variant?: CTAButtonVariant;
  children?: React.ReactNode;
  text?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<CTAButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

export default function CTAButton({
  variant = "primary",
  children,
  text,
  className,
  onClick,
  disabled,
  type = "button",
}: CTAButtonProps) {
  return (
    <Button
      type={type}
      variant={variant === "primary" ? "default" : variant === "secondary" ? "secondary" : "destructive"}
      className={cn(
        "px-6 py-3 rounded-lg font-semibold transition-all duration-200",
        variantStyles[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children || text}
    </Button>
  );
}
