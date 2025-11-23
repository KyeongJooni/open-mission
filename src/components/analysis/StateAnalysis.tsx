import { useState, useEffect, useRef } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import * as THREE from 'three';
import { ScrollProgress } from '@/components';

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
  const bgRef = useRef<HTMLDivElement>(null);

  // Three.js background
  useEffect(() => {
    if (!bgRef.current) {
      return;
    }

    const container = bgRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

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
      <div ref={bgRef} className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }} />

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
            {/* Pie Chart */}
            <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-gray-900 mb-4 text-sm font-semibold">상태 타입 비율</h2>
              <div className="h-96">
                <ResponsivePie
                  data={pieData}
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
                        {((datum.value / data.summary.totalStateUsages) * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-gray-900 mb-4 text-sm font-semibold">상태 타입별 사용량</h2>
              <div className="h-96">
                <ResponsiveBar
                  data={barData}
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
          </div>

          {/* Additional Charts */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {/* HeatMap */}
            <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-gray-900 mb-4 text-sm font-semibold">컴포넌트 × 상태 타입 매트릭스</h2>
              <div className="h-96">
                <ResponsiveHeatMap
                  data={heatMapData}
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
                    scheme: 'purples',
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

            {/* Top Components Bar Chart */}
            <div className="border-gray-200 rounded-lg border bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-gray-900 mb-4 text-sm font-semibold">Top 10 컴포넌트 상태 사용량</h2>
              <div className="h-96">
                <ResponsiveBar
                  data={topComponentsData}
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
          </div>

          {/* Suggestions */}
          {data.suggestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-gray-900 mb-4 text-sm font-semibold">개선 제안</h2>
              <div className="space-y-2">
                {data.suggestions.map((suggestion, index) => (
                  <SuggestionItem key={index} suggestion={suggestion} />
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
                  <ComponentItem key={index} component={comp} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SuggestionItem = ({ suggestion }: { suggestion: Suggestion }) => {
  const icon = suggestion.type === 'warning' ? '⚠️' : suggestion.type === 'info' ? 'ℹ️' : '💡';

  return (
    <div className="border-gray-200 rounded-lg border bg-white/80 p-3 backdrop-blur-sm">
      <div className="flex items-start gap-2">
        <span className="text-sm">{icon}</span>
        <div className="flex-1 text-xs">
          <div className="text-gray-900 font-medium">{suggestion.component}</div>
          <div className="text-gray-700 mt-1">{suggestion.message}</div>
        </div>
      </div>
    </div>
  );
};

const ComponentItem = ({ component }: { component: ComponentInfo }) => {
  return (
    <div className="border-gray-200 rounded-lg border bg-white/80 p-3 backdrop-blur-sm">
      <div className="text-gray-900 mb-1 text-sm font-medium">{component.name}</div>
      <div className="text-gray-500 mb-2 text-xs">{component.file}</div>
      <div className="flex flex-wrap gap-1">
        {component.stateUsages.map((usage, i) => (
          <span key={i} className="bg-gray-100 text-gray-700 inline-flex items-center rounded px-2 py-0.5 text-xs">
            {usage.type}
            <span className="text-gray-400 ml-1">: {usage.line}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
