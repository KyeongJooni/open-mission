import { ResponsiveBar } from '@nivo/bar';

interface TopComponentData {
  component: string;
  useState: number;
  zustand: number;
}

interface AnalysisTopComponentsProps {
  data: TopComponentData[];
}

export const AnalysisTopComponents = ({ data }: AnalysisTopComponentsProps) => {
  return (
    <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="text-gray-900 mb-4 text-sm font-semibold">Top 10 컴포넌트 상태 사용량</h2>
      <div className="h-96">
        <ResponsiveBar
          data={data}
          keys={['useState', 'zustand']}
          indexBy="component"
          layout="horizontal"
          margin={{ top: 20, right: 20, bottom: 50, left: 120 }}
          padding={0.3}
          colors={['#6366f1', '#ec4899']}
          borderRadius={4}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          enableGridX={true}
          enableGridY={false}
          labelSkipWidth={12}
          labelTextColor="#ffffff"
          motionConfig="gentle"
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom',
              direction: 'row',
              translateY: 50,
              itemWidth: 80,
              itemHeight: 18,
              itemTextColor: '#374151',
              symbolSize: 12,
              symbolShape: 'circle',
            },
          ]}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#6b7280',
                  fontSize: 10,
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
          tooltip={({ id, value, indexValue }) => (
            <div className="rounded-lg bg-white px-3 py-2 shadow-lg">
              <div className="text-gray-900 text-sm font-medium">{indexValue}</div>
              <div className="text-gray-500 text-xs">
                {id}: {value}개
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
