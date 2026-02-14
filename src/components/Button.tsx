import type { PropsWithChildren } from "react";

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color?: "primary" | "secondary";
}

export const Button = ({ onClick, children }: PropsWithChildren<ButtonProps>) => (
  <button className="px-3 py-1 border-1 rounded-sm hover:bg-red-200 cursor-pointer lowercase font-mono" onClick={onClick}>{children}</button>
)

