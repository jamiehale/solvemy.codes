import type { ComponentProps } from 'react';

interface LetterProps extends ComponentProps<'div'> {
  outlined?: boolean;
  selected?: boolean;
}

export const Letter = ({ className, outlined, selected, children, ...rest }: LetterProps) => (
  <div {...rest} className={`flex flex-col justify-center align-center items-center uppercase font-bold w-[1.1em] px-3 border-1 border-solid rounded-sm ${outlined ? (selected ? 'border-red-400' : 'border-black') : 'border-transparent'} ${className}`}>
    {children}
  </div>
)
