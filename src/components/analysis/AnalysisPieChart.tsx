import { ResponsivePie } from '@nivo/pie';

interface PieData {
  id: string;
  label: string;
  value: number;
}

interface AnalysisPieChartProps {
  data: PieData[];
  totalStateUsages: number;
}

export const AnalysisPieChart = ({ data, totalStateUsages }: AnalysisPieChartProps) => {
  return (
    <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="text-gray-900 mb-4 text-sm font-semibold">상태 타입 비율</h2>
      <div className="h-96">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
          innerRadius={0.5}
          padAngle={0.5}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          colors={['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          motionConfig="gentle"
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 20,
              itemWidth: 80,
              itemHeight: 18,
              itemTextColor: '#374151',
              itemDirection: 'left-to-right',
              symbolSize: 12,
              symbolShape: 'circle',
            },
          ]}
          tooltip={({ datum }) => (
            <div className="rounded-lg bg-white px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: datum.color }} />
                <span className="text-gray-900 text-sm font-medium">
                  {datum.id}: {datum.value}개
                </span>
              </div>
              <div className="text-gray-500 mt-1 text-xs">
                {((datum.value / totalStateUsages) * 100).toFixed(1)}%
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
