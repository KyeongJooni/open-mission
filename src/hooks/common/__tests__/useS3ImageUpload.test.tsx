import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useS3ImageUpload } from '../useS3ImageUpload';
import { ToastProvider } from '@/contexts/ToastContext';

const mockMutateAsync = jest.fn();
const mockShowToast = jest.fn();

jest.mock('@/api/image/imageQuery', () => ({
  useUploadImageMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
};

describe('useS3ImageUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('이미지 업로드 성공 시 URL을 반환해야 함', async () => {
    const imageUrl = 'https://s3.amazonaws.com/test.jpg';
    mockMutateAsync.mockResolvedValue({ imageUrl });

    const { result } = renderHook(() => useS3ImageUpload(), {
      wrapper: createWrapper(),
    });

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    let returnedUrl: string | null = null;
    await act(async () => {
      returnedUrl = await result.current.uploadImage(file);
    });

    expect(returnedUrl).toBe(imageUrl);
  });

  it('이미지 타입이 아닌 파일은 경고를 표시해야 함', async () => {
    const { result } = renderHook(() => useS3ImageUpload(), {
      wrapper: createWrapper(),
    });

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    let returnedUrl: string | null = null;
    await act(async () => {
      returnedUrl = await result.current.uploadImage(file);
    });

    expect(returnedUrl).toBe(null);
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('파일 크기가 초과되면 경고를 표시해야 함', async () => {
    const { result } = renderHook(() => useS3ImageUpload(), {
      wrapper: createWrapper(),
    });

    // 6MB 파일 생성 (5MB 초과)
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

    let returnedUrl: string | null = null;
    await act(async () => {
      returnedUrl = await result.current.uploadImage(file);
    });

    expect(returnedUrl).toBe(null);
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('업로드 실패 시 에러 토스트를 표시해야 함', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useS3ImageUpload(), {
      wrapper: createWrapper(),
    });

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    let returnedUrl: string | null = null;
    await act(async () => {
      returnedUrl = await result.current.uploadImage(file);
    });

    expect(returnedUrl).toBe(null);
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'warning');
  });

  it('onSuccess 콜백이 호출되어야 함', async () => {
    const imageUrl = 'https://s3.amazonaws.com/test.jpg';
    mockMutateAsync.mockResolvedValue({ imageUrl });

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useS3ImageUpload({ onSuccess }), { wrapper: createWrapper() });

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.uploadImage(file);
    });

    expect(onSuccess).toHaveBeenCalledWith(imageUrl);
  });

  it('onError 콜백이 호출되어야 함', async () => {
    const error = new Error('Upload failed');
    mockMutateAsync.mockRejectedValue(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useS3ImageUpload({ onError }), { wrapper: createWrapper() });

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.uploadImage(file);
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('isUploading 상태를 반환해야 함', () => {
    const { result } = renderHook(() => useS3ImageUpload(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isUploading).toBe(false);
  });
});
