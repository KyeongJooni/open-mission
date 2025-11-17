import { renderHook, act } from '@testing-library/react';
import { useImagePreview } from '../useImagePreview';

describe('useImagePreview', () => {
  // FileReader mock 설정
  let mockFileReader: {
    readAsDataURL: jest.Mock;
    onloadend: (() => void) | null;
    result: string | null;
  };

  beforeEach(() => {
    mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null,
      result: null,
    };

    // FileReader를 mock으로 대체
    global.FileReader = jest.fn(() => mockFileReader) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('초기 상태', () => {
    it('previewImage가 빈 문자열이어야 함', () => {
      const { result } = renderHook(() => useImagePreview());

      expect(result.current.previewImage).toBe('');
    });
  });

  describe('generatePreview', () => {
    it('파일을 base64로 변환하여 previewImage를 설정해야 함', () => {
      const { result } = renderHook(() => useImagePreview());

      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockBase64 = 'data:image/png;base64,mockImageData';

      act(() => {
        result.current.generatePreview(mockFile);
      });

      // FileReader.readAsDataURL이 호출되었는지 확인
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

      // onloadend 시뮬레이션
      act(() => {
        mockFileReader.result = mockBase64;
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend();
        }
      });

      expect(result.current.previewImage).toBe(mockBase64);
    });

    it('여러 번 호출해도 최신 이미지로 업데이트되어야 함', () => {
      const { result } = renderHook(() => useImagePreview());

      const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['test2'], 'test2.png', { type: 'image/png' });
      const base64_1 = 'data:image/png;base64,image1';
      const base64_2 = 'data:image/png;base64,image2';

      // 첫 번째 파일
      act(() => {
        result.current.generatePreview(file1);
        mockFileReader.result = base64_1;
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend();
        }
      });

      expect(result.current.previewImage).toBe(base64_1);

      // 두 번째 파일
      act(() => {
        result.current.generatePreview(file2);
        mockFileReader.result = base64_2;
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend();
        }
      });

      expect(result.current.previewImage).toBe(base64_2);
    });
  });

  describe('setPreviewImage', () => {
    it('직접 호출하여 previewImage를 설정할 수 있어야 함', () => {
      const { result } = renderHook(() => useImagePreview());

      const testUrl = 'https://example.com/image.jpg';

      act(() => {
        result.current.setPreviewImage(testUrl);
      });

      expect(result.current.previewImage).toBe(testUrl);
    });
  });

  describe('clearPreview', () => {
    it('previewImage를 빈 문자열로 초기화해야 함', () => {
      const { result } = renderHook(() => useImagePreview());

      // 먼저 이미지 설정
      act(() => {
        result.current.setPreviewImage('https://example.com/image.jpg');
      });

      expect(result.current.previewImage).toBe('https://example.com/image.jpg');

      // 클리어
      act(() => {
        result.current.clearPreview();
      });

      expect(result.current.previewImage).toBe('');
    });
  });

  describe('메모이제이션', () => {
    it('generatePreview 함수가 리렌더 간에 동일한 참조를 유지해야 함', () => {
      const { result, rerender } = renderHook(() => useImagePreview());

      const firstGeneratePreview = result.current.generatePreview;
      const firstClearPreview = result.current.clearPreview;

      rerender();

      expect(result.current.generatePreview).toBe(firstGeneratePreview);
      expect(result.current.clearPreview).toBe(firstClearPreview);
    });
  });
});
