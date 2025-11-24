import { render, screen } from '@testing-library/react';
import { AnalysisPieChart } from '../AnalysisPieChart';

jest.mock('@nivo/pie', () => ({
  ResponsivePie: ({ data, tooltip }: any) => (
    <div data-testid="responsive-pie">
      {data.map((item: any, index: number) => (
        <div key={index} data-testid={`pie-item-${index}`}>
          {item.id}: {item.value}
        </div>
      ))}
      {tooltip && tooltip({ datum: { id: 'useState', value: 10, color: '#6366f1' } })}
    </div>
  ),
}));

describe('AnalysisPieChart', () => {
  const mockData = [
    { id: 'useState', label: 'useState', value: 10 },
    { id: 'zustand', label: 'zustand', value: 5 },
  ];

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<AnalysisPieChart data={mockData} totalStateUsages={15} />);

    expect(screen.getByText('상태 타입 비율')).toBeInTheDocument();
  });

  it('차트가 렌더링되어야 함', () => {
    render(<AnalysisPieChart data={mockData} totalStateUsages={15} />);

    expect(screen.getByTestId('responsive-pie')).toBeInTheDocument();
  });

  it('데이터가 표시되어야 함', () => {
    render(<AnalysisPieChart data={mockData} totalStateUsages={15} />);

    expect(screen.getByText('useState: 10')).toBeInTheDocument();
    expect(screen.getByText('zustand: 5')).toBeInTheDocument();
  });

  it('툴팁이 렌더링되어야 함', () => {
    render(<AnalysisPieChart data={mockData} totalStateUsages={15} />);

    expect(screen.getByText('useState: 10개')).toBeInTheDocument();
    expect(screen.getByText('66.7%')).toBeInTheDocument();
  });
});
