import { render, screen } from '@testing-library/react';
import { AnalysisPage } from '../AnalysisPage';

// Mock AnalysisState component
jest.mock('@/components/analysis/AnalysisState', () => ({
  AnalysisState: () => <div data-testid="analysis-state">Analysis State Mock</div>,
}));

describe('AnalysisPage', () => {
  it('renders the page container', () => {
    render(<AnalysisPage />);

    const container = document.querySelector('.min-h-screen.bg-white');
    expect(container).toBeInTheDocument();
  });

  it('renders AnalysisState component', () => {
    render(<AnalysisPage />);

    expect(screen.getByTestId('analysis-state')).toBeInTheDocument();
  });
});
