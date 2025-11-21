// Cypress E2E 테스트 지원 파일

// 커스텀 명령어 임포트
import './commands';

// 테스트 실패 시 콘솔 에러 로깅
Cypress.on('uncaught:exception', (err, runnable) => {
  // React의 개발 모드 에러는 무시
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});
