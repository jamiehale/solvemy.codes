interface IfElseProps {
  condition: boolean;
  renderIf: () => React.ReactNode;
  renderElse: () => React.ReactNode;
}

export const IfElse = ({ condition, renderIf, renderElse }: IfElseProps) => {
  if (condition) {
    return renderIf();
  }
  return renderElse();
}
