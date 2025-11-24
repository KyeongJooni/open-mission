import { render, screen } from '@testing-library/react';
import { AnalysisComponentItem } from '../AnalysisComponentItem';

describe('AnalysisComponentItem', () => {
  it('renders component name and file path', () => {
    const component = {
      name: 'LoginForm',
      file: 'src/components/auth/LoginForm.tsx',
      stateUsages: [],
    };

    render(<AnalysisComponentItem component={component} />);

    expect(screen.getByText('LoginForm')).toBeInTheDocument();
    expect(screen.getByText('src/components/auth/LoginForm.tsx')).toBeInTheDocument();
  });

  it('renders state usages with type and line number', () => {
    const component = {
      name: 'SignupForm',
      file: 'src/components/auth/SignupForm.tsx',
      stateUsages: [
        { type: 'useState', name: 'email', file: 'SignupForm.tsx', line: 10, component: 'SignupForm' },
        { type: 'useEffect', name: '', file: 'SignupForm.tsx', line: 25, component: 'SignupForm' },
        { type: 'useMemo', name: 'computed', file: 'SignupForm.tsx', line: 30, component: 'SignupForm' },
      ],
    };

    render(<AnalysisComponentItem component={component} />);

    expect(screen.getByText('useState')).toBeInTheDocument();
    expect(screen.getByText(': 10')).toBeInTheDocument();
    expect(screen.getByText('useEffect')).toBeInTheDocument();
    expect(screen.getByText(': 25')).toBeInTheDocument();
    expect(screen.getByText('useMemo')).toBeInTheDocument();
    expect(screen.getByText(': 30')).toBeInTheDocument();
  });

  it('renders with empty state usages', () => {
    const component = {
      name: 'StaticComponent',
      file: 'src/components/StaticComponent.tsx',
      stateUsages: [],
    };

    render(<AnalysisComponentItem component={component} />);

    expect(screen.getByText('StaticComponent')).toBeInTheDocument();
    expect(screen.getByText('src/components/StaticComponent.tsx')).toBeInTheDocument();
  });

  it('renders multiple state usages of the same type', () => {
    const component = {
      name: 'MultiStateForm',
      file: 'src/components/MultiStateForm.tsx',
      stateUsages: [
        { type: 'useState', name: 'name', file: 'MultiStateForm.tsx', line: 5, component: 'MultiStateForm' },
        { type: 'useState', name: 'email', file: 'MultiStateForm.tsx', line: 6, component: 'MultiStateForm' },
      ],
    };

    render(<AnalysisComponentItem component={component} />);

    const useStateElements = screen.getAllByText('useState');
    expect(useStateElements).toHaveLength(2);
  });
});
