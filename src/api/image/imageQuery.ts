import { useMutation } from '@tanstack/react-query';
import { uploadImage } from './imageApi';
import type { UploadImageParams, UploadImageResult } from './imageTypes';

export const useUploadImageMutation = () => {
  return useMutation<UploadImageResult, Error, UploadImageParams>({
    mutationFn: ({ file }) => uploadImage(file),
  });
};
