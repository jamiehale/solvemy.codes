import type { PropsWithChildren } from "react";

interface ButtonProps {
  type?: HTMLButtonElement["type"];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color?: "primary" | "secondary";
}

export const Button = ({ type, onClick, children }: PropsWithChildren<ButtonProps>) => (
  <button type={type ?? 'button'} className="px-4 py-1 border-1 rounded-sm hover:bg-red-200 cursor-pointer lowercase font-mono" onClick={onClick}>{children}</button>
)

