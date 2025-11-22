import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '../useImageUpload';

const mockUploadImage = jest.fn();

jest.mock('@/hooks/common/useS3ImageUpload', () => ({
  useS3ImageUpload: () => ({
    uploadImage: mockUploadImage,
  }),
}));

describe('useImageUpload', () => {
  const mockSetMarkdownContent = jest.fn();
  const mockQuillRef = {
    current: {
      getEditor: () => ({
        getSelection: () => ({ index: 0 }),
        insertEmbed: jest.fn(),
        setSelection: jest.fn(),
        getLength: () => 10,
      }),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('핸들러들을 반환해야 함', () => {
    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'basic',
        markdownContent: '',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: mockQuillRef as any,
      })
    );

    expect(result.current.handleImageUpload).toBeDefined();
    expect(result.current.handleImageDrop).toBeDefined();
    expect(result.current.handleImagePaste).toBeDefined();
  });

  it('basic 모드에서 이미지를 업로드해야 함', async () => {
    mockUploadImage.mockResolvedValue('https://example.com/image.jpg');

    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'basic',
        markdownContent: '',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: mockQuillRef as any,
      })
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.handleImageUpload(file);
    });

    expect(mockUploadImage).toHaveBeenCalledWith(file);
  });

  it('markdown 모드에서 이미지를 업로드해야 함', async () => {
    mockUploadImage.mockResolvedValue('https://example.com/image.jpg');

    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'markdown',
        markdownContent: '기존 내용',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: undefined,
      })
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.handleImageUpload(file);
    });

    expect(mockUploadImage).toHaveBeenCalledWith(file);
    expect(mockSetMarkdownContent).toHaveBeenCalledWith(
      expect.stringContaining('![test.jpg](https://example.com/image.jpg)')
    );
  });

  it('업로드 실패 시 아무것도 하지 않아야 함', async () => {
    mockUploadImage.mockResolvedValue(null);

    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'basic',
        markdownContent: '',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: mockQuillRef as any,
      })
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      const url = await result.current.handleImageUpload(file);
      expect(url).toBeUndefined();
    });
  });

  it('이미지 드롭을 처리해야 함', async () => {
    mockUploadImage.mockResolvedValue('https://example.com/image.jpg');

    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'basic',
        markdownContent: '',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: mockQuillRef as any,
      })
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        files: [file],
      },
    } as unknown as React.DragEvent<HTMLDivElement>;

    await act(async () => {
      await result.current.handleImageDrop(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockUploadImage).toHaveBeenCalled();
  });

  it('이미지 붙여넣기를 처리해야 함', async () => {
    mockUploadImage.mockResolvedValue('https://example.com/image.jpg');

    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'basic',
        markdownContent: '',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: mockQuillRef as any,
      })
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      preventDefault: jest.fn(),
      clipboardData: {
        items: [
          {
            type: 'image/jpeg',
            getAsFile: () => file,
          },
        ],
      },
    } as unknown as React.ClipboardEvent<HTMLDivElement>;

    await act(async () => {
      await result.current.handleImagePaste(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockUploadImage).toHaveBeenCalled();
  });

  it('이미지가 아닌 파일은 무시해야 함', async () => {
    const { result } = renderHook(() =>
      useImageUpload({
        mode: 'basic',
        markdownContent: '',
        setMarkdownContent: mockSetMarkdownContent,
        quillRef: mockQuillRef as any,
      })
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        files: [file],
      },
    } as unknown as React.DragEvent<HTMLDivElement>;

    await act(async () => {
      await result.current.handleImageDrop(mockEvent);
    });

    expect(mockUploadImage).not.toHaveBeenCalled();
  });
});
