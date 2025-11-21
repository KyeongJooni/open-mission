import { render, screen } from '@/test-utils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('렌더링', () => {
    it('기본 메시지를 표시해야 함', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });

    it('커스텀 메시지를 표시해야 함', () => {
      render(<LoadingSpinner message="데이터 불러오는 중..." />);
      expect(screen.getByText('데이터 불러오는 중...')).toBeInTheDocument();
    });

    it('빈 메시지를 표시할 수 있어야 함', () => {
      render(<LoadingSpinner message="" />);
      expect(screen.queryByText('로딩 중...')).not.toBeInTheDocument();
    });
  });
});
