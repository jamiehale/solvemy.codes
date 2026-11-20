import type { ComponentProps } from 'react';

interface LetterProps extends ComponentProps<'div'> {
  outlined?: boolean;
}

export const Letter = ({ className, outlined, children, ...rest }: LetterProps) => (
  <div {...rest} className={`flex flex-col justify-center align-center items-center uppercase font-bold w-[1.1em] px-3 border-1 border-solid rounded-sm ${outlined ? 'border-black' : 'border-transparent'} ${className}`}>
    {children}
  </div>
)
