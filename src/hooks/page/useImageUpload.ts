import { useCallback } from 'react';
import type ReactQuill from 'react-quill';
import type { EditorMode } from '@/types/blog';
import { useS3ImageUpload } from '@/hooks/common/useS3ImageUpload';

interface UseImageUploadProps {
  mode: EditorMode;
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  quillRef?: React.RefObject<ReactQuill>;
}

export const useImageUpload = ({ mode, markdownContent, setMarkdownContent, quillRef }: UseImageUploadProps) => {
  const { uploadImage: uploadImageToS3 } = useS3ImageUpload();

  // ReactQuill 에디터 이미지 삽입
  const insertImageToQuill = useCallback(
    (imageUrl: string) => {
      const quill = quillRef?.current?.getEditor();

      if (quill) {
        const range = quill.getSelection(true);

        if (range) {
          quill.insertEmbed(range.index, 'image', imageUrl);
          quill.setSelection(range.index + 1, 0);
        } else {
          // selection이 없으면 맨 끝에 삽입
          const length = quill.getLength();
          quill.insertEmbed(length - 1, 'image', imageUrl);
        }
      }
    },
    [quillRef]
  );

  // 마크다운 에디터 이미지 삽입
  const insertImageToMarkdown = useCallback(
    (imageUrl: string, fileName: string) => {
      const imageMarkdown = `\n![${fileName}](${imageUrl})\n`;
      setMarkdownContent(markdownContent + imageMarkdown);
    },
    [markdownContent, setMarkdownContent]
  );

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    async (file: File) => {
      // S3에 업로드
      const imageUrl = await uploadImageToS3(file);
      if (!imageUrl) {
        return;
      }

      // 모드 별 이미지 삽입
      if (mode === 'basic') {
        insertImageToQuill(imageUrl);
      } else if (mode === 'markdown') {
        insertImageToMarkdown(imageUrl, file.name);
      }

      return imageUrl;
    },
    [mode, uploadImageToS3, insertImageToQuill, insertImageToMarkdown]
  );

  // 이미지 드롭 핸들러
  const handleImageDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));

      for (const file of imageFiles) {
        await handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  // 이미지 붙여넣기 핸들러
  const handleImagePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter(item => item.type.startsWith('image/'));

      if (imageItems.length > 0) {
        e.preventDefault();
        for (const item of imageItems) {
          const file = item.getAsFile();
          if (file) {
            await handleImageUpload(file);
          }
        }
      }
    },
    [handleImageUpload]
  );

  return {
    handleImageUpload,
    handleImageDrop,
    handleImagePaste,
  };
};
