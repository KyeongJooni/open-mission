import { useUploadImageMutation } from '@/api/image/imageQuery';
import { useToast } from '@/contexts/ToastContext';
import { IMAGE_UPLOAD, IMAGE_TEXTS } from '@/constants';

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
      if (!file.type.startsWith(IMAGE_UPLOAD.ALLOWED_TYPES[0])) {
        showToast(IMAGE_TEXTS.UPLOAD.INVALID_TYPE, 'warning');
        return null;
      }

      // 파일 크기 제한
      if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
        showToast(IMAGE_TEXTS.UPLOAD.SIZE_EXCEEDED, 'warning');
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
      showToast(IMAGE_TEXTS.UPLOAD.FAILED, 'warning');

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
