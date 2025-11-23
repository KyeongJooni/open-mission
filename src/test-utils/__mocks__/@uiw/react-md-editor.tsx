const MDEditor = ({ value, ...props }: { value?: string; [key: string]: unknown }) => (
  <div data-testid="md-editor" {...props}>
    {value}
  </div>
);

MDEditor.Markdown = ({ source, ...props }: { source?: string; [key: string]: unknown }) => (
  <div data-testid="md-preview" {...props}>
    {source}
  </div>
);

export default MDEditor;
