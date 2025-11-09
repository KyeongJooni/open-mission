export const hasMarkdownSyntax = (text: string): boolean => {
  if (!text) {
    return false;
  }

  const markdownPatterns = [
    /^#{1,6}\s/m, // 헤딩 (# ## ### 등)
    /\*\*.*\*\*/, // 볼드 (**텍스트**)
    /\*.*\*/, // 이탤릭 (*텍스트*)
    /\[.*\]\(.*\)/, // 링크 [텍스트](URL)
    /^[-*+]\s/m, // 리스트 (- * +)
    /^>\s/m, // 인용 (>)
    /`.*`/, // 인라인 코드 (`코드`)
    /```[\s\S]*```/, // 코드 블록 (```코드```)
    /^\d+\.\s/m, // 숫자 리스트 (1. 2. 3.)
    /^---+$/m, // 수평선 (---)
    /~~.*~~/, // 취소선 (~~텍스트~~)
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
};
