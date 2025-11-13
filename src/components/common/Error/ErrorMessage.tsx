interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message = '오류가 발생했습니다.', onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4 text-lg text-warning">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-hover">
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};
