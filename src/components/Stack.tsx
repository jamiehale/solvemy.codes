import type { PropsWithChildren } from "react";

interface StackProps {
  className?: string;
  horizontal?: boolean;
}

export const Stack = ({ className, horizontal, children }: PropsWithChildren<StackProps>) => (
  <div className={`flex ${horizontal ? 'flex-row' : 'flex-col'} ${className}`}>{children}</div>
)

