import { render, screen } from '@testing-library/react';
import { AnalysisTopComponents } from '../AnalysisTopComponents';

jest.mock('@nivo/bar', () => ({
  ResponsiveBar: ({ data, tooltip }: any) => (
    <div data-testid="responsive-bar">
      {data.map((item: any, index: number) => (
        <div key={index} data-testid={`bar-item-${index}`}>
          {item.component}: useState={item.useState}, zustand={item.zustand}
        </div>
      ))}
      {tooltip && tooltip({ id: 'useState', value: 5, indexValue: 'TestComponent' })}
    </div>
  ),
}));

describe('AnalysisTopComponents', () => {
  const mockData = [
    { component: 'Header', useState: 3, zustand: 1 },
    { component: 'Sidebar', useState: 2, zustand: 2 },
    { component: 'Footer', useState: 1, zustand: 0 },
  ];

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<AnalysisTopComponents data={mockData} />);

    expect(screen.getByText('Top 10 컴포넌트 상태 사용량')).toBeInTheDocument();
  });

  it('차트가 렌더링되어야 함', () => {
    render(<AnalysisTopComponents data={mockData} />);

    expect(screen.getByTestId('responsive-bar')).toBeInTheDocument();
  });

  it('데이터가 표시되어야 함', () => {
    render(<AnalysisTopComponents data={mockData} />);

    expect(screen.getByText('Header: useState=3, zustand=1')).toBeInTheDocument();
    expect(screen.getByText('Sidebar: useState=2, zustand=2')).toBeInTheDocument();
    expect(screen.getByText('Footer: useState=1, zustand=0')).toBeInTheDocument();
  });

  it('툴팁이 렌더링되어야 함', () => {
    render(<AnalysisTopComponents data={mockData} />);

    expect(screen.getByText('TestComponent')).toBeInTheDocument();
    expect(screen.getByText('useState: 5개')).toBeInTheDocument();
  });

  it('빈 데이터로도 렌더링되어야 함', () => {
    render(<AnalysisTopComponents data={[]} />);

    expect(screen.getByText('Top 10 컴포넌트 상태 사용량')).toBeInTheDocument();
  });
});
