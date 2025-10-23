interface DividerProps {
  className?: string;
}

const Divider = ({ className = '' }: DividerProps) => {
  return <div className={`h-px w-[580px] bg-gray-96 ${className}`} />;
};

export default Divider;
