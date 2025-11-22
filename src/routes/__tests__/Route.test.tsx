import router from '../Route';

describe('Router', () => {
  it('라우터가 정의되어 있어야 함', () => {
    expect(router).toBeDefined();
  });

  it('라우터에 routes가 있어야 함', () => {
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBeGreaterThan(0);
  });
});
