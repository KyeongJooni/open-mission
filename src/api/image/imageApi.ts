import { axiosInstance } from '../apiInstance';
import type { ApiResponse } from '../apiTypes';
import type * as ImageTypes from './imageTypes';

// Presigned URL 가져오기
export const getPresignedUrl = async (fileName: string): Promise<ApiResponse<ImageTypes.PresignedUrlData>> => {
  const response = await axiosInstance.get<ApiResponse<ImageTypes.PresignedUrlData>>('/images/presigned-url', {
    params: { fileName },
  });
  return response.data;
};

// S3에 이미지 업로드
export const uploadImageToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};
