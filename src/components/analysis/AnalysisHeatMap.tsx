import { ResponsiveHeatMap } from '@nivo/heatmap';

interface HeatMapData {
  id: string;
  data: { x: string; y: number }[];
}

interface AnalysisHeatMapProps {
  data: HeatMapData[];
}

export const AnalysisHeatMap = ({ data }: AnalysisHeatMapProps) => {
  return (
    <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="text-gray-900 mb-4 text-sm font-semibold">컴포넌트 × 상태 타입 매트릭스</h2>
      <div className="h-96">
        <ResponsiveHeatMap
          data={data}
          margin={{ top: 20, right: 20, bottom: 60, left: 100 }}
          axisTop={null}
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
          colors={{
            type: 'sequential',
            scheme: 'purple_blue',
          }}
          emptyColor="#f3f4f6"
          borderRadius={4}
          borderWidth={2}
          borderColor="#ffffff"
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          motionConfig="gentle"
          hoverTarget="cell"
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#6b7280',
                  fontSize: 10,
                },
              },
            },
          }}
          tooltip={({ cell }: { cell: { serieId: string; data: { x: string; y: number } } }) => (
            <div className="rounded-lg bg-white px-3 py-2 shadow-lg">
              <div className="text-gray-900 text-sm font-medium">{cell.serieId}</div>
              <div className="text-gray-500 text-xs">
                {cell.data.x}: {cell.data.y}개
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
