import { useUploadImageMutation } from '@/api/image/imageQuery';
import { useToast } from '@/contexts/ToastContext';

interface UseImageUploadOptions {
  onSuccess?: (imageUrl: string) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

export const useS3ImageUpload = (options?: UseImageUploadOptions) => {
  const uploadImageMutation = useUploadImageMutation();
  const { showToast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        showToast('이미지 파일만 선택해주세요.', 'warning');
        return null;
      }

      // 파일 크기 제한 (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast('이미지 크기는 5MB 이하여야 합니다.', 'warning');
        return null;
      }

      // S3 업로드
      const result = await uploadImageMutation.mutateAsync({ file });
      const imageUrl = result.imageUrl;

      // 성공 콜백
      if (options?.onSuccess) {
        await options.onSuccess(imageUrl);
      }

      return imageUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      showToast('이미지 업로드에 실패했습니다.', 'warning');

      // 에러 콜백
      if (options?.onError) {
        options.onError(error);
      }

      return null;
    }
  };

  return {
    uploadImage,
    isUploading: uploadImageMutation.isPending,
  };
};
