import { useState, useEffect } from 'react';
import { ScrollProgress } from '@/components';
import { AnalysisParticleBackground } from './AnalysisParticleBackground';
import { AnalysisSuggestionItem } from './AnalysisSuggestionItem';
import { AnalysisComponentItem } from './AnalysisComponentItem';
import { AnalysisPieChart } from './AnalysisPieChart';
import { AnalysisBarChart } from './AnalysisBarChart';
import { AnalysisHeatMap } from './AnalysisHeatMap';
import { AnalysisTopComponents } from './AnalysisTopComponents';

interface StateUsage {
  type: string;
  name: string;
  file: string;
  line: number;
  component: string;
}

interface ComponentInfo {
  name: string;
  file: string;
  stateUsages: StateUsage[];
}

interface Suggestion {
  type: 'warning' | 'info' | 'improvement';
  message: string;
  file: string;
  component: string;
}

interface AnalysisResult {
  summary: {
    totalComponents: number;
    totalStateUsages: number;
    byType: Record<string, number>;
  };
  components: ComponentInfo[];
  suggestions: Suggestion[];
}

export const AnalysisState = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/state-analysis.json')
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('분석 데이터를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  // Prepare data for Nivo charts
  const pieData = data
    ? Object.entries(data.summary.byType).map(([id, value]) => ({
        id,
        label: id,
        value,
      }))
    : [];

  const barData = data
    ? Object.entries(data.summary.byType).map(([type, count]) => ({
        type,
        count,
      }))
    : [];

  // HeatMap data - component vs state type matrix
  const heatMapData = data
    ? data.components
        .filter(comp => comp.stateUsages.length > 0)
        .sort((a, b) => b.stateUsages.length - a.stateUsages.length)
        .slice(0, 10)
        .map(comp => ({
          id: comp.name.length > 12 ? comp.name.slice(0, 12) + '...' : comp.name,
          data: [
            { x: 'useState', y: comp.stateUsages.filter(u => u.type === 'useState').length },
            { x: 'zustand', y: comp.stateUsages.filter(u => u.type === 'zustand').length },
            { x: 'context', y: comp.stateUsages.filter(u => u.type === 'context').length },
          ],
        }))
    : [];

  // Horizontal bar data for top components
  const topComponentsData = data
    ? data.components
        .filter(c => c.stateUsages.length > 0)
        .sort((a, b) => b.stateUsages.length - a.stateUsages.length)
        .slice(0, 10)
        .map(comp => ({
          component: comp.name.length > 15 ? comp.name.slice(0, 15) + '...' : comp.name,
          useState: comp.stateUsages.filter(u => u.type === 'useState').length,
          zustand: comp.stateUsages.filter(u => u.type === 'zustand').length,
        }))
    : [];

  return (
    <div className="relative min-h-screen w-full">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Three.js Background */}
      <AnalysisParticleBackground />

      {loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {data && (
        <div className="w-full px-12 py-8" style={{ minWidth: '880px' }}>
          <h1 className="text-gray-900 mb-2 text-2xl font-bold">상태 분석 결과</h1>
          <p className="text-gray-500 mb-8 text-sm">React 상태 관리 패턴 분석</p>

          {/* Summary */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="border-gray-200 rounded-lg border bg-white/80 p-4 backdrop-blur-sm">
              <div className="text-gray-900 text-2xl font-bold">{data.summary.totalComponents}</div>
              <div className="text-gray-500 text-xs">총 컴포넌트</div>
            </div>
            <div className="border-gray-200 rounded-lg border bg-white/80 p-4 backdrop-blur-sm">
              <div className="text-gray-900 text-2xl font-bold">{data.summary.totalStateUsages}</div>
              <div className="text-gray-500 text-xs">상태 사용</div>
            </div>
            <div className="border-gray-200 rounded-lg border bg-white/80 p-4 backdrop-blur-sm">
              <div className="text-gray-900 text-2xl font-bold">{data.summary.byType['useState'] || 0}</div>
              <div className="text-gray-500 text-xs">useState</div>
            </div>
            <div className="border-gray-200 rounded-lg border bg-white/80 p-4 backdrop-blur-sm">
              <div className="text-gray-900 text-2xl font-bold">{data.summary.byType['zustand'] || 0}</div>
              <div className="text-gray-500 text-xs">Zustand</div>
            </div>
          </div>

          {/* Charts */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <AnalysisPieChart data={pieData} totalStateUsages={data.summary.totalStateUsages} />
            <AnalysisBarChart data={barData} />
          </div>

          {/* Additional Charts */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <AnalysisHeatMap data={heatMapData} />
            <AnalysisTopComponents data={topComponentsData} />
          </div>

          {/* Suggestions */}
          {data.suggestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-gray-900 mb-4 text-sm font-semibold">개선 제안</h2>
              <div className="space-y-2">
                {data.suggestions.map((suggestion, index) => (
                  <AnalysisSuggestionItem key={index} suggestion={suggestion} />
                ))}
              </div>
            </div>
          )}

          {/* Components */}
          <div>
            <h2 className="text-gray-900 mb-4 text-sm font-semibold">컴포넌트별 상세</h2>
            <div className="space-y-3">
              {data.components
                .filter(comp => comp.stateUsages.length > 0)
                .map((comp, index) => (
                  <AnalysisComponentItem key={index} component={comp} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
