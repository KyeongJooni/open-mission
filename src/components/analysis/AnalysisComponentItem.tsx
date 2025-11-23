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

interface AnalysisComponentItemProps {
  component: ComponentInfo;
}

export const AnalysisComponentItem = ({ component }: AnalysisComponentItemProps) => {
  return (
    <div className="border-gray-200 rounded-lg border bg-white/80 p-3 backdrop-blur-sm">
      <div className="text-gray-900 mb-1 text-sm font-medium">{component.name}</div>
      <div className="text-gray-500 mb-2 text-xs">{component.file}</div>
      <div className="flex flex-wrap gap-1">
        {component.stateUsages.map((usage, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 inline-flex items-center rounded px-2 py-0.5 text-xs"
          >
            {usage.type}
            <span className="text-gray-400 ml-1">: {usage.line}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
