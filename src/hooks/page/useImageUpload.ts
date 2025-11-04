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

  // ReactQuill 에디터에 이미지 삽입
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

  // 마크다운 에디터에 이미지 삽입
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

      // 모드에 따라 다른 방식으로 이미지 삽입
      if (mode === 'basic') {
        insertImageToQuill(imageUrl);
      } else if (mode === 'markdown') {
        insertImageToMarkdown(imageUrl, file.name);
      }

      return imageUrl;
    },
    [mode, uploadImageToS3, insertImageToQuill, insertImageToMarkdown]
  );

  return {
    handleImageUpload,
  };
};
