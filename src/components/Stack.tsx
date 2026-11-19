import type { ComponentProps } from "react";

interface StackProps extends ComponentProps<"div"> {
  horizontal?: boolean;
}

export const Stack = ({ className, horizontal, children, ...rest }: StackProps) => (
  <div {...rest} className={`flex ${horizontal ? 'flex-row' : 'flex-col'} ${className}`}>{children}</div>
)
