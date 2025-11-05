import { axiosInstance } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import type * as ImageTypes from './imageTypes';

// Presigned URL
export const getPresignedUrl = async (fileName: string): Promise<ApiResponse<ImageTypes.PresignedUrlData>> => {
  const response = await axiosInstance.get<ApiResponse<ImageTypes.PresignedUrlData>>('/images/presigned-url', {
    params: { fileName },
  });
  return response.data;
};

// S3에 이미지 업로드
export const uploadImageToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status}`);
  }
};

// 이미지 업로드 커스텀 훅
export const uploadImage = async (file: File): Promise<ImageTypes.UploadImageResult> => {
  const response = await getPresignedUrl(file.name);
  const presignedUrl = response.data;
  await uploadImageToS3(presignedUrl, file);
  const imageUrl = presignedUrl.split('?')[0];
  return { imageUrl };
};
