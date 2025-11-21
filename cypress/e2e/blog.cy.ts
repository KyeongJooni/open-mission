describe('블로그 기능', () => {
  const mockPosts = {
    code: 200,
    message: 'success',
    data: {
      content: [
        {
          postId: '1',
          title: '첫 번째 포스트',
          writerNickname: 'testuser',
          writerProfileImage: '',
          likeCount: 10,
          commentCount: 5,
          createdAt: '2024-01-01T00:00:00',
          isLiked: false,
          contents: [
            {
              type: 'TEXT',
              content: '테스트 콘텐츠입니다.',
              contentOrder: 1,
            },
          ],
        },
        {
          postId: '2',
          title: '두 번째 포스트',
          writerNickname: 'testuser2',
          writerProfileImage: '',
          likeCount: 5,
          commentCount: 2,
          createdAt: '2024-01-02T00:00:00',
          isLiked: true,
          contents: [
            {
              type: 'TEXT',
              content: '두 번째 콘텐츠입니다.',
              contentOrder: 1,
            },
          ],
        },
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
      },
      totalElements: 2,
      totalPages: 1,
      last: true,
      first: true,
    },
  };

  beforeEach(() => {
    cy.intercept('GET', '**/posts/all', mockPosts).as('getPosts');
    cy.intercept('GET', '**/posts/all/token', mockPosts).as('getPostsAuth');
  });

  describe('블로그 목록', () => {
    it('홈 페이지가 렌더링되어야 함', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('블로그 상세', () => {
    const mockPostDetail = {
      code: 200,
      message: 'success',
      data: {
        postId: '1',
        title: '첫 번째 포스트',
        writerNickname: 'testuser',
        writerProfileImage: '',
        likeCount: 10,
        commentCount: 5,
        createdAt: '2024-01-01T00:00:00',
        isLiked: false,
        isOwner: false,
        contents: [
          {
            type: 'TEXT',
            content: '테스트 콘텐츠입니다.',
            contentOrder: 1,
          },
        ],
        comments: [],
      },
    };

    beforeEach(() => {
      cy.intercept('GET', '**/posts?postId=1', mockPostDetail).as('getPostDetail');
      cy.intercept('GET', '**/posts/token?postId=1', mockPostDetail).as('getPostDetailAuth');
    });

    it('블로그 상세 페이지가 렌더링되어야 함', () => {
      cy.visit('/blog/1');
      cy.url().should('include', '/blog/1');
    });
  });

  describe('블로그 작성', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/posts', {
        statusCode: 200,
        body: {
          code: 200,
          message: 'success',
          data: {},
        },
      }).as('createPost');

      // 로그인 상태 시뮬레이션
      cy.window().then((win) => {
        win.sessionStorage.setItem('accessToken', 'test-access-token');
        win.sessionStorage.setItem('refreshToken', 'test-refresh-token');
      });
    });

    it('블로그 작성 페이지가 렌더링되어야 함', () => {
      cy.visit('/blog/write');
      cy.url().should('include', '/blog/write');
    });
  });
});
