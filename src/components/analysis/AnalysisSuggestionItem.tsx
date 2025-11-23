interface Suggestion {
  type: 'warning' | 'info' | 'improvement';
  message: string;
  file: string;
  component: string;
}

interface AnalysisSuggestionItemProps {
  suggestion: Suggestion;
}

export const AnalysisSuggestionItem = ({ suggestion }: AnalysisSuggestionItemProps) => {
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
