const MAX_CONTENT_LENGTH = 255;

export const splitContentByLength = (text: string, maxLength = MAX_CONTENT_LENGTH): string[] => {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    chunks.push(remaining.substring(0, maxLength));
    remaining = remaining.substring(maxLength);
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
};

export { MAX_CONTENT_LENGTH };
