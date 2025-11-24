import { render, screen } from '@testing-library/react';
import { AnalysisBarChart } from '../AnalysisBarChart';

jest.mock('@nivo/bar', () => ({
  ResponsiveBar: ({ data, tooltip }: any) => (
    <div data-testid="responsive-bar">
      {data.map((item: any, index: number) => (
        <div key={index} data-testid={`bar-item-${index}`}>
          {item.type}: {item.count}
        </div>
      ))}
      {tooltip && tooltip({ value: 10, indexValue: 'test' })}
    </div>
  ),
}));

describe('AnalysisBarChart', () => {
  const mockData = [
    { type: 'useState', count: 10 },
    { type: 'zustand', count: 5 },
    { type: 'context', count: 3 },
  ];

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<AnalysisBarChart data={mockData} />);

    expect(screen.getByText('상태 타입별 사용량')).toBeInTheDocument();
  });

  it('차트가 렌더링되어야 함', () => {
    render(<AnalysisBarChart data={mockData} />);

    expect(screen.getByTestId('responsive-bar')).toBeInTheDocument();
  });

  it('데이터가 표시되어야 함', () => {
    render(<AnalysisBarChart data={mockData} />);

    expect(screen.getByText('useState: 10')).toBeInTheDocument();
    expect(screen.getByText('zustand: 5')).toBeInTheDocument();
    expect(screen.getByText('context: 3')).toBeInTheDocument();
  });

  it('툴팁이 렌더링되어야 함', () => {
    render(<AnalysisBarChart data={mockData} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('10개 사용')).toBeInTheDocument();
  });

  it('빈 데이터로도 렌더링되어야 함', () => {
    render(<AnalysisBarChart data={[]} />);

    expect(screen.getByText('상태 타입별 사용량')).toBeInTheDocument();
  });
});
