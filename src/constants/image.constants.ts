export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/'],
} as const;

export const IMAGE_TEXTS = {
  UPLOAD: {
    INVALID_TYPE: '이미지 파일만 선택해주세요.',
    SIZE_EXCEEDED: '이미지 크기는 5MB 이하여야 합니다.',
    FAILED: '이미지 업로드에 실패했습니다.',
  },
} as const;
