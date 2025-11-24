import { render, screen } from '@testing-library/react';
import PageHeaderRight from '../PageHeaderRight';

jest.mock('@/components/common/PageHeader/PageHeaderRightRenderers', () => ({
  PageHeaderRenderers: {
    main: () => <div data-testid="main-renderer">Main</div>,
    detail: () => <div data-testid="detail-renderer">Detail</div>,
    write: () => <div data-testid="write-renderer">Write</div>,
    mypage: () => <div data-testid="mypage-renderer">MyPage</div>,
    editprofile: ({ onEdit, onCancel }: any) => (
      <div data-testid="edit-profile-renderer">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ),
  },
}));

describe('PageHeaderRight', () => {
  it('main 타입일 때 main 렌더러를 사용해야 함', () => {
    render(<PageHeaderRight type="main" />);

    expect(screen.getByTestId('main-renderer')).toBeInTheDocument();
  });

  it('detail 타입일 때 detail 렌더러를 사용해야 함', () => {
    render(<PageHeaderRight type="detail" />);

    expect(screen.getByTestId('detail-renderer')).toBeInTheDocument();
  });

  it('write 타입일 때 write 렌더러를 사용해야 함', () => {
    render(<PageHeaderRight type="write" />);

    expect(screen.getByTestId('write-renderer')).toBeInTheDocument();
  });

  it('mypage 타입일 때 mypage 렌더러를 사용해야 함', () => {
    render(<PageHeaderRight type="mypage" />);

    expect(screen.getByTestId('mypage-renderer')).toBeInTheDocument();
  });

  it('editProfile 타입일 때 onEdit과 onCancel을 전달해야 함', () => {
    render(<PageHeaderRight type="editprofile" onEdit={() => {}} onCancel={() => {}} />);

    expect(screen.getByTestId('edit-profile-renderer')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
