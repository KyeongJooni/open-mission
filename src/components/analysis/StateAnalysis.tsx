import { useState, useEffect } from 'react';

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

export const StateAnalysis = () => {
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

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-xl font-bold text-gray-900">상태 분석 결과</h1>
      <p className="mb-8 text-sm text-gray-500">React 상태 관리 패턴 분석</p>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{data.summary.totalComponents}</div>
          <div className="text-xs text-gray-500">총 컴포넌트</div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{data.summary.totalStateUsages}</div>
          <div className="text-xs text-gray-500">상태 사용</div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{data.summary.byType['useState'] || 0}</div>
          <div className="text-xs text-gray-500">useState</div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{data.summary.byType['zustand'] || 0}</div>
          <div className="text-xs text-gray-500">Zustand</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">상태 타입별 분포</h2>
        <BarChart data={data.summary.byType} />
      </div>

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">개선 제안</h2>
          <div className="space-y-2">
            {data.suggestions.map((suggestion, index) => (
              <SuggestionItem key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {/* Components */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-900">컴포넌트별 상세</h2>
        <div className="space-y-3">
          {data.components
            .filter(comp => comp.stateUsages.length > 0)
            .map((comp, index) => (
              <ComponentItem key={index} component={comp} />
            ))}
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data }: { data: Record<string, number> }) => {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="space-y-3">
      {entries.map(([type, count]) => (
        <div key={type}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-700">{type}</span>
            <span className="font-medium text-gray-900">{count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SuggestionItem = ({ suggestion }: { suggestion: Suggestion }) => {
  const icon = suggestion.type === 'warning' ? '⚠️' : suggestion.type === 'info' ? 'ℹ️' : '💡';

  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="flex items-start gap-2">
        <span className="text-sm">{icon}</span>
        <div className="flex-1 text-xs">
          <div className="font-medium text-gray-900">{suggestion.component}</div>
          <div className="mt-1 text-gray-700">{suggestion.message}</div>
        </div>
      </div>
    </div>
  );
};

const ComponentItem = ({ component }: { component: ComponentInfo }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="mb-2 text-sm font-medium text-gray-900">{component.name}</div>
      <div className="flex flex-wrap gap-1">
        {component.stateUsages.map((usage, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
          >
            {usage.type}
            <span className="ml-1 text-gray-400">:{usage.line}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
