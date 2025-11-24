import { render, screen } from '@testing-library/react';
import { AnalysisSuggestionItem } from '../AnalysisSuggestionItem';

describe('AnalysisSuggestionItem', () => {
  it('renders warning suggestion with correct icon', () => {
    const suggestion = {
      type: 'warning' as const,
      message: 'Too many state variables',
      file: 'src/components/Form.tsx',
      component: 'LoginForm',
    };

    render(<AnalysisSuggestionItem suggestion={suggestion} />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('LoginForm')).toBeInTheDocument();
    expect(screen.getByText('Too many state variables')).toBeInTheDocument();
  });

  it('renders info suggestion with correct icon', () => {
    const suggestion = {
      type: 'info' as const,
      message: 'Consider using useReducer',
      file: 'src/components/Form.tsx',
      component: 'SignupForm',
    };

    render(<AnalysisSuggestionItem suggestion={suggestion} />);

    expect(screen.getByText('ℹ️')).toBeInTheDocument();
    expect(screen.getByText('SignupForm')).toBeInTheDocument();
    expect(screen.getByText('Consider using useReducer')).toBeInTheDocument();
  });

  it('renders improvement suggestion with correct icon', () => {
    const suggestion = {
      type: 'improvement' as const,
      message: 'Can be optimized with useMemo',
      file: 'src/components/Dashboard.tsx',
      component: 'Dashboard',
    };

    render(<AnalysisSuggestionItem suggestion={suggestion} />);

    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Can be optimized with useMemo')).toBeInTheDocument();
  });
});
