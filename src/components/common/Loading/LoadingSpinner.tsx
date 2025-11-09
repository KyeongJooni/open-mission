interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = '로딩 중...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-gray-600">{message}</div>
    </div>
  );
};
