import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // 리팩토링 시 Sentry 전송
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorMessage message={this.state.error?.message || '문제가 발생했습니다.'} onRetry={this.handleReset} />;
    }

    return this.props.children;
  }
}
