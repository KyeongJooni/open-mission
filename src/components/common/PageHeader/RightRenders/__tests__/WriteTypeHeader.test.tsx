import { render, screen, fireEvent } from '@testing-library/react';
import { WriteTypeHeader } from '../WriteTypeHeader';

const mockHandleDeleteClick = jest.fn();
const mockHandlePublishClick = jest.fn();
const mockCloseModal = jest.fn();
const mockOnModalConfirm = jest.fn();

jest.mock('@/hooks', () => ({
  useWriteTypeHeader: () => ({
    handleDeleteClick: mockHandleDeleteClick,
    handlePublishClick: mockHandlePublishClick,
    modalType: null,
    confirmButtonText: '확인',
    onModalConfirm: mockOnModalConfirm,
    closeModal: mockCloseModal,
  }),
}));

jest.mock('@/components', () => ({
  Modal: ({ isOpen, children }: any) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

describe('WriteTypeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('삭제 버튼을 렌더링해야 함', () => {
    render(<WriteTypeHeader />);

    expect(screen.getByText('삭제하기')).toBeInTheDocument();
  });

  it('발행 버튼을 렌더링해야 함', () => {
    render(<WriteTypeHeader />);

    expect(screen.getByText('게시하기')).toBeInTheDocument();
  });

  it('삭제 버튼 클릭 시 handleDeleteClick을 호출해야 함', () => {
    render(<WriteTypeHeader />);

    fireEvent.click(screen.getByText('삭제하기'));

    expect(mockHandleDeleteClick).toHaveBeenCalled();
  });

  it('발행 버튼 클릭 시 handlePublishClick을 호출해야 함', () => {
    render(<WriteTypeHeader />);

    fireEvent.click(screen.getByText('게시하기'));

    expect(mockHandlePublishClick).toHaveBeenCalled();
  });
});
