import { ResponsiveBar } from '@nivo/bar';

interface BarData {
  type: string;
  count: number;
}

interface AnalysisBarChartProps {
  data: BarData[];
}

export const AnalysisBarChart = ({ data }: AnalysisBarChartProps) => {
  return (
    <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="text-gray-900 mb-4 text-sm font-semibold">상태 타입별 사용량</h2>
      <div className="h-96">
        <ResponsiveBar
          data={data}
          keys={['count']}
          indexBy="type"
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          padding={0.4}
          colors={['#6366f1']}
          borderRadius={4}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
          }}
          enableGridY={true}
          gridYValues={5}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          motionConfig="gentle"
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#6b7280',
                  fontSize: 11,
                },
              },
            },
            grid: {
              line: {
                stroke: '#e5e7eb',
                strokeWidth: 1,
              },
            },
          }}
          tooltip={({ value, indexValue }) => (
            <div className="rounded-lg bg-white px-3 py-2 shadow-lg">
              <div className="text-gray-900 text-sm font-medium">{indexValue}</div>
              <div className="text-gray-500 text-xs">{value}개 사용</div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
