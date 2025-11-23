import { render, screen, fireEvent } from '@/test-utils';
import Modal from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>모달 내용</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('렌더링', () => {
    it('isOpen이 true면 모달을 렌더링해야 함', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('모달 내용')).toBeInTheDocument();
    });

    it('isOpen이 false면 모달을 렌더링하지 않아야 함', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('children을 렌더링해야 함', () => {
      render(<Modal {...defaultProps}>테스트 콘텐츠</Modal>);
      expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
    });
  });

  describe('버튼', () => {
    it('기본 취소 버튼 텍스트를 표시해야 함', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('취소')).toBeInTheDocument();
    });

    it('커스텀 취소 버튼 텍스트를 표시해야 함', () => {
      render(<Modal {...defaultProps} cancelButtonText="닫기" />);
      expect(screen.getByText('닫기')).toBeInTheDocument();
    });

    it('onDelete가 있으면 확인 버튼을 표시해야 함', () => {
      render(<Modal {...defaultProps} onDelete={jest.fn()} />);
      expect(screen.getByText('삭제하기')).toBeInTheDocument();
    });

    it('onDelete가 없으면 확인 버튼을 표시하지 않아야 함', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.queryByText('삭제하기')).not.toBeInTheDocument();
    });

    it('커스텀 확인 버튼 텍스트를 표시해야 함', () => {
      render(<Modal {...defaultProps} onDelete={jest.fn()} confirmButtonText="확인" />);
      expect(screen.getByText('확인')).toBeInTheDocument();
    });
  });

  describe('이벤트', () => {
    it('취소 버튼 클릭 시 onClose가 호출되어야 함', () => {
      render(<Modal {...defaultProps} />);

      fireEvent.click(screen.getByText('취소'));

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('확인 버튼 클릭 시 onDelete가 호출되어야 함', () => {
      const onDelete = jest.fn();
      render(<Modal {...defaultProps} onDelete={onDelete} />);

      fireEvent.click(screen.getByText('삭제하기'));

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('배경 클릭 시 onClose가 호출되어야 함', () => {
      render(<Modal {...defaultProps} />);

      const backdrop = screen.getByRole('presentation');
      fireEvent.click(backdrop);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('모달 콘텐츠 클릭 시 onClose가 호출되지 않아야 함', () => {
      render(<Modal {...defaultProps} />);

      fireEvent.click(screen.getByRole('dialog'));

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('접근성', () => {
    it('dialog role이 있어야 함', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal이 true여야 함', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-labelledby를 설정할 수 있어야 함', () => {
      render(<Modal {...defaultProps} ariaLabelledBy="modal-title" />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
    });
  });
});
