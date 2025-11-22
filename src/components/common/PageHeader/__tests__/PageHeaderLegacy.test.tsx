import { render, screen } from '@testing-library/react';
import PageHeaderLegacy from '../PageHeaderLegacy';

const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  useLocation: () => mockUseLocation(),
}));

jest.mock('@/assets/icons', () => ({
  AddPhotoAlternateIcon: () => <svg data-testid="add-photo-icon" />,
  FolderOpenIcon: () => <svg data-testid="folder-icon" />,
}));

jest.mock('@/components', () => ({
  Icon: ({ children }: any) => <span data-testid="icon">{children}</span>,
}));

describe('PageHeaderLegacy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('일반 페이지에서 사진 추가하기 버튼을 표시해야 함', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    render(<PageHeaderLegacy />);

    expect(screen.getByText('사진 추가하기')).toBeInTheDocument();
  });

  it('일반 페이지에서 파일 추가하기 버튼을 표시해야 함', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    render(<PageHeaderLegacy />);

    expect(screen.getByText('파일 추가하기')).toBeInTheDocument();
  });

  it('글쓰기 페이지에서 버튼들을 숨겨야 함', () => {
    mockUseLocation.mockReturnValue({ pathname: '/blog/write' });
    render(<PageHeaderLegacy />);

    expect(screen.queryByText('사진 추가하기')).not.toBeInTheDocument();
    expect(screen.queryByText('파일 추가하기')).not.toBeInTheDocument();
  });

  it('className을 적용해야 함', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    const { container } = render(<PageHeaderLegacy className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('아이콘들을 렌더링해야 함', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    render(<PageHeaderLegacy />);

    expect(screen.getAllByTestId('icon')).toHaveLength(2);
  });
});
