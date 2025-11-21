describe('인증 플로우', () => {
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

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        code: 200,
        message: 'success',
        data: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
        },
      },
    }).as('login');

    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          email: 'test@test.com',
        },
      },
    }).as('register');
  });

  describe('로그인 모달', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('홈 페이지가 정상 렌더링되어야 함', () => {
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('로그인 버튼 클릭 시 모달이 열려야 함', () => {
      // 로그인 버튼 찾기 (헤더 또는 사이드바에 있을 수 있음)
      cy.contains('로그인').click();

      // 모달이 열렸는지 확인
      cy.get('[role="dialog"]').should('be.visible');
    });

    it('모달에서 이메일과 비밀번호를 입력할 수 있어야 함', () => {
      cy.contains('로그인').click();
      cy.get('[role="dialog"]').should('be.visible');

      // 입력 필드가 있는지 확인
      cy.get('[role="dialog"] input[type="email"], [role="dialog"] input[name="email"]')
        .should('be.visible')
        .type('test@test.com');

      cy.get('[role="dialog"] input[type="password"], [role="dialog"] input[name="password"]')
        .should('be.visible')
        .type('Password1!');
    });
  });

  describe('회원가입', () => {
    beforeEach(() => {
      cy.visit('/mypage/signup');
    });

    it('회원가입 페이지가 렌더링되어야 함', () => {
      cy.url().should('include', '/mypage/signup');
    });

    it('필수 필드를 입력할 수 있어야 함', () => {
      // 이메일 입력
      cy.get('input[name="email"], input[type="email"]').first().type('newuser@test.com');

      // 비밀번호 입력
      cy.get('input[name="password"], input[type="password"]').first().type('Password1!');
    });
  });
});
