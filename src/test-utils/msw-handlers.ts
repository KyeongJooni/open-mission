import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://blog.leets.land';

export const handlers = [
  // 인증 관련
  http.post(`${BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      data: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      },
    });
  }),

  http.post(`${BASE_URL}/auth/signup`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        email: 'test@test.com',
        nickname: 'testuser',
      },
    }, { status: 201 });
  }),

  http.post(`${BASE_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      },
    });
  }),

  http.post(`${BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // 블로그 관련
  http.get(`${BASE_URL}/blogs`, () => {
    return HttpResponse.json({
      data: {
        content: [
          {
            id: 1,
            title: 'Test Blog Post',
            content: [{ type: 'TEXT', value: 'Test content' }],
            author: { id: 1, nickname: 'testuser' },
            createdAt: '2025-01-01T00:00:00Z',
          },
        ],
        totalPages: 1,
        totalElements: 1,
        last: true,
      },
    });
  }),

  http.get(`${BASE_URL}/blogs/:id`, ({ params }) => {
    return HttpResponse.json({
      data: {
        id: Number(params.id),
        title: 'Test Blog Post',
        content: [{ type: 'TEXT', value: 'Test content' }],
        author: { id: 1, nickname: 'testuser' },
        createdAt: '2025-01-01T00:00:00Z',
        comments: [],
      },
    });
  }),

  http.post(`${BASE_URL}/blogs`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        title: 'New Blog Post',
      },
    }, { status: 201 });
  }),

  http.put(`${BASE_URL}/blogs/:id`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        title: 'Updated Blog Post',
      },
    });
  }),

  http.delete(`${BASE_URL}/blogs/:id`, () => {
    return HttpResponse.json({ message: 'Deleted successfully' });
  }),

  // 댓글 관련
  http.post(`${BASE_URL}/blogs/:blogId/comments`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        content: 'Test comment',
      },
    }, { status: 201 });
  }),

  http.put(`${BASE_URL}/comments/:id`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        content: 'Updated comment',
      },
    });
  }),

  http.delete(`${BASE_URL}/comments/:id`, () => {
    return HttpResponse.json({ message: 'Deleted successfully' });
  }),

  // 사용자 관련
  http.get(`${BASE_URL}/users/me`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        email: 'test@test.com',
        nickname: 'testuser',
        profileImage: null,
        introduction: null,
      },
    });
  }),

  http.put(`${BASE_URL}/users/me`, () => {
    return HttpResponse.json({
      data: {
        id: 1,
        nickname: 'updateduser',
      },
    });
  }),

  // 이미지 업로드
  http.post(`${BASE_URL}/images/presigned-url`, () => {
    return HttpResponse.json({
      data: {
        presignedUrl: 'https://s3.amazonaws.com/test-bucket/test-image.jpg',
        imageUrl: 'https://cdn.example.com/test-image.jpg',
      },
    });
  }),
];
