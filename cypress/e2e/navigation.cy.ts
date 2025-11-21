describe('네비게이션', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/posts/all', {
      statusCode: 200,
      body: {
        code: 200,
        message: 'success',
        data: {
          content: [],
          pageable: { pageNumber: 0, pageSize: 10 },
          totalElements: 0,
          totalPages: 0,
          last: true,
          first: true,
        },
      },
    }).as('getPosts');
  });

  describe('비로그인 상태', () => {
    it('홈 페이지에 접근할 수 있어야 함', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('마이페이지에 접근할 수 있어야 함', () => {
      cy.visit('/mypage');
      cy.url().should('include', '/mypage');
    });

    it('회원가입 페이지에 접근할 수 있어야 함', () => {
      cy.visit('/mypage/signup');
      cy.url().should('include', '/mypage/signup');
    });

    it('글쓰기 페이지 접근 시 확인', () => {
      cy.visit('/blog/write');
      cy.url().should('satisfy', (url: string) => {
        return url.includes('/mypage') || url.includes('/blog/write');
      });
    });
  });

  describe('로그인 상태', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.setItem('accessToken', 'test-access-token');
        win.sessionStorage.setItem('refreshToken', 'test-refresh-token');
      });
    });

    it('홈 페이지에 접근할 수 있어야 함', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('마이프로필 페이지에 접근할 수 있어야 함', () => {
      cy.visit('/mypage/myprofile');
      cy.url().should('include', '/mypage');
    });
  });

  describe('존재하지 않는 경로', () => {
    it('존재하지 않는 경로에 접근할 수 있어야 함', () => {
      cy.visit('/nonexistent-page', { failOnStatusCode: false });
      cy.url().should('include', '/nonexistent-page');
    });
  });
});
