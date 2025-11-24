import { render, screen, waitFor } from '@testing-library/react';
import { AnalysisState } from '../AnalysisState';

// Mock child components
jest.mock('../AnalysisParticleBackground', () => ({
  AnalysisParticleBackground: () => <div data-testid="particle-background" />,
}));

jest.mock('../AnalysisPieChart', () => ({
  AnalysisPieChart: ({ data, totalStateUsages }: any) => (
    <div data-testid="pie-chart">
      <span data-testid="pie-total">{totalStateUsages}</span>
      <span data-testid="pie-data">{JSON.stringify(data)}</span>
    </div>
  ),
}));

jest.mock('../AnalysisBarChart', () => ({
  AnalysisBarChart: ({ data }: any) => (
    <div data-testid="bar-chart">
      <span data-testid="bar-data">{JSON.stringify(data)}</span>
    </div>
  ),
}));

jest.mock('../AnalysisHeatMap', () => ({
  AnalysisHeatMap: ({ data }: any) => (
    <div data-testid="heat-map">
      <span data-testid="heatmap-data">{JSON.stringify(data)}</span>
    </div>
  ),
}));

jest.mock('../AnalysisTopComponents', () => ({
  AnalysisTopComponents: ({ data }: any) => (
    <div data-testid="top-components">
      <span data-testid="top-data">{JSON.stringify(data)}</span>
    </div>
  ),
}));

jest.mock('@/components', () => ({
  ScrollProgress: () => <div data-testid="scroll-progress" />,
}));

describe('AnalysisState', () => {
  const mockAnalysisData = {
    summary: {
      totalComponents: 50,
      totalStateUsages: 120,
      byType: {
        useState: 80,
        zustand: 30,
        context: 10,
      },
    },
    components: [
      {
        name: 'LoginForm',
        file: 'src/components/LoginForm.tsx',
        stateUsages: [
          { type: 'useState', name: 'email', file: 'LoginForm.tsx', line: 10, component: 'LoginForm' },
          { type: 'useState', name: 'password', file: 'LoginForm.tsx', line: 11, component: 'LoginForm' },
        ],
      },
      {
        name: 'Dashboard',
        file: 'src/components/Dashboard.tsx',
        stateUsages: [
          { type: 'zustand', name: 'user', file: 'Dashboard.tsx', line: 5, component: 'Dashboard' },
        ],
      },
      {
        name: 'StaticComponent',
        file: 'src/components/Static.tsx',
        stateUsages: [],
      },
    ],
    suggestions: [
      {
        type: 'warning' as const,
        message: 'Too many useState calls',
        file: 'LoginForm.tsx',
        component: 'LoginForm',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    render(<AnalysisState />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('분석 데이터를 불러올 수 없습니다.')).toBeInTheDocument();
    });
  });

  it('renders analysis data when fetch succeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('상태 분석 결과')).toBeInTheDocument();
    });

    expect(screen.getByText('React 상태 관리 패턴 분석')).toBeInTheDocument();
  });

  it('displays summary statistics correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument(); // totalComponents
    });

    expect(screen.getAllByText('120').length).toBeGreaterThan(0); // totalStateUsages
    expect(screen.getAllByText('80').length).toBeGreaterThan(0); // useState count
    expect(screen.getAllByText('30').length).toBeGreaterThan(0); // zustand count
  });

  it('renders all chart components', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('heat-map')).toBeInTheDocument();
    expect(screen.getByTestId('top-components')).toBeInTheDocument();
  });

  it('renders suggestions section', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('개선 제안')).toBeInTheDocument();
    });
  });

  it('renders component details section', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('컴포넌트별 상세')).toBeInTheDocument();
    });
  });

  it('filters out components with no state usages', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('컴포넌트별 상세')).toBeInTheDocument();
    });

    // StaticComponent has no state usages and should not appear
    expect(screen.queryByText('StaticComponent')).not.toBeInTheDocument();
  });

  it('renders ScrollProgress and ParticleBackground', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAnalysisData),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
    expect(screen.getByTestId('particle-background')).toBeInTheDocument();
  });

  it('does not render suggestions section when there are no suggestions', async () => {
    const dataWithoutSuggestions = {
      ...mockAnalysisData,
      suggestions: [],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(dataWithoutSuggestions),
      })
    ) as jest.Mock;

    render(<AnalysisState />);

    await waitFor(() => {
      expect(screen.getByText('상태 분석 결과')).toBeInTheDocument();
    });

    expect(screen.queryByText('개선 제안')).not.toBeInTheDocument();
  });
});
