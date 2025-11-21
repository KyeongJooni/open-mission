import { createBlog, updateBlog, deleteBlog, fetchBlogDetail, fetchBlogs } from '../blog/blogApi';
import { axiosInstance } from '../apiInstance';

jest.mock('../apiInstance', () => ({
  axiosInstance: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  setAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
}));

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('blogApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBlog', () => {
    it('블로그 생성 성공 시 데이터를 반환해야 함', async () => {
      const mockResponse = { data: { data: {} } };
      (mockedAxios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createBlog({
        title: '테스트 제목',
        contents: [{ contentType: 'TEXT', content: '테스트', contentOrder: 1 }],
      });

      expect(mockedAxios.post).toHaveBeenCalledWith('/posts', expect.any(Object));
      expect(result.data).toBeDefined();
    });

    it('블로그 생성 실패 시 에러를 throw해야 함', async () => {
      (mockedAxios.post as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      await expect(
        createBlog({ title: '테스트', contents: [] })
      ).rejects.toThrow();
    });
  });

  describe('updateBlog', () => {
    it('블로그 수정 성공 시 데이터를 반환해야 함', async () => {
      const mockResponse = { data: { data: {} } };
      (mockedAxios.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updateBlog('123', {
        title: '수정된 제목',
        contents: [{ contentType: 'TEXT', content: '수정', contentOrder: 1 }],
      });

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/posts',
        expect.any(Object),
        { params: { postId: '123' } }
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteBlog', () => {
    it('블로그 삭제 성공 시 데이터를 반환해야 함', async () => {
      const mockResponse = { data: { data: {} } };
      (mockedAxios.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await deleteBlog('123');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/posts', {
        params: { postId: '123' },
      });
      expect(result.data).toBeDefined();
    });
  });

  describe('fetchBlogDetail', () => {
    const mockBlogDetail = {
      id: 1,
      title: '테스트 블로그',
      contents: [{ contentType: 'TEXT', content: '본문', contentOrder: 1 }],
      author: { id: 1, nickname: 'testuser' },
      createdAt: '2025-01-01T00:00:00Z',
    };

    it('로그인 상태에서 블로그 상세를 조회해야 함', async () => {
      const mockResponse = { data: { data: mockBlogDetail } };
      (mockedAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchBlogDetail('1', true);

      expect(mockedAxios.get).toHaveBeenCalledWith('/posts/token', {
        params: { postId: '1' },
      });
      expect(result.data.title).toBe('테스트 블로그');
    });

    it('비로그인 상태에서 블로그 상세를 조회해야 함', async () => {
      const mockResponse = { data: { data: mockBlogDetail } };
      (mockedAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchBlogDetail('1', false);

      expect(mockedAxios.get).toHaveBeenCalledWith('/posts', {
        params: { postId: '1' },
      });
      expect(result.data.title).toBe('테스트 블로그');
    });
  });

  describe('fetchBlogs', () => {
    const mockBlogList = {
      posts: [
        { id: 1, title: '첫 번째 글' },
        { id: 2, title: '두 번째 글' },
      ],
      pageMax: 5,
    };

    it('로그인 상태에서 블로그 목록을 조회해야 함', async () => {
      const mockResponse = { data: { data: mockBlogList } };
      (mockedAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchBlogs(1, 10, true);

      expect(mockedAxios.get).toHaveBeenCalledWith('/posts/all/token', {
        params: { page: 1, size: 10 },
      });
      expect(result.data.posts).toHaveLength(2);
    });

    it('비로그인 상태에서 블로그 목록을 조회해야 함', async () => {
      const mockResponse = { data: { data: mockBlogList } };
      (mockedAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchBlogs(1, 10, false);

      expect(mockedAxios.get).toHaveBeenCalledWith('/posts/all', {
        params: { page: 1, size: 10 },
      });
      expect(result.data.posts).toHaveLength(2);
    });

    it('페이지네이션 파라미터를 전달해야 함', async () => {
      const mockResponse = { data: { data: mockBlogList } };
      (mockedAxios.get as jest.Mock).mockResolvedValue(mockResponse);

      await fetchBlogs(2, 20, false);

      expect(mockedAxios.get).toHaveBeenCalledWith('/posts/all', {
        params: { page: 2, size: 20 },
      });
    });
  });
});
