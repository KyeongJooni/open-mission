import { useState, useCallback } from 'react';

export const useImagePreview = () => {
  const [previewImage, setPreviewImage] = useState<string>('');

  const generatePreview = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewImage('');
  }, []);

  return {
    previewImage,
    setPreviewImage,
    generatePreview,
    clearPreview,
  };
};
