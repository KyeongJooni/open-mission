import { render, screen } from '@testing-library/react';
import { AnalysisHeatMap } from '../AnalysisHeatMap';

// Mock @nivo/heatmap
jest.mock('@nivo/heatmap', () => ({
  ResponsiveHeatMap: ({ data, tooltip }: any) => (
    <div data-testid="mock-heatmap">
      <div data-testid="heatmap-data">{JSON.stringify(data)}</div>
      {tooltip && (
        <div data-testid="heatmap-tooltip">
          {tooltip({
            cell: {
              serieId: 'TestComponent',
              data: { x: 'useState', y: 5 },
            },
          })}
        </div>
      )}
    </div>
  ),
}));

describe('AnalysisHeatMap', () => {
  const mockData = [
    {
      id: 'LoginForm',
      data: [
        { x: 'useState', y: 3 },
        { x: 'useEffect', y: 2 },
      ],
    },
    {
      id: 'SignupForm',
      data: [
        { x: 'useState', y: 5 },
        { x: 'useEffect', y: 1 },
      ],
    },
  ];

  it('renders heatmap with title', () => {
    render(<AnalysisHeatMap data={mockData} />);

    expect(screen.getByText('컴포넌트 × 상태 타입 매트릭스')).toBeInTheDocument();
  });

  it('passes data to ResponsiveHeatMap', () => {
    render(<AnalysisHeatMap data={mockData} />);

    const heatmapData = screen.getByTestId('heatmap-data');
    expect(heatmapData.textContent).toContain('LoginForm');
    expect(heatmapData.textContent).toContain('SignupForm');
  });

  it('renders tooltip with correct format', () => {
    render(<AnalysisHeatMap data={mockData} />);

    expect(screen.getByText('TestComponent')).toBeInTheDocument();
    expect(screen.getByText('useState: 5개')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<AnalysisHeatMap data={[]} />);

    expect(screen.getByTestId('mock-heatmap')).toBeInTheDocument();
  });
});
