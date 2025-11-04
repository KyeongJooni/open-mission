import { useMutation } from '@tanstack/react-query';
import { getPresignedUrl, uploadImageToS3 } from './imageApi';
import type { UploadImageParams, UploadImageResult } from './imageTypes';

export const useUploadImageMutation = () => {
  return useMutation<UploadImageResult, Error, UploadImageParams>({
    mutationFn: async ({ file }) => {
      const response = await getPresignedUrl(file.name);
      const presignedUrl = response.data;
      await uploadImageToS3(presignedUrl, file);
      const imageUrl = presignedUrl.split('?')[0];
      return { imageUrl };
    },
  });
};
