export interface GetPresignedUrlRequest {
  fileName: string;
}

export type PresignedUrlData = string;

export interface UploadImageParams {
  file: File;
}

export interface UploadImageResult {
  imageUrl: string;
}
