import { render, screen } from '@testing-library/react';
import { PageHeaderRenderers } from '../PageHeaderRightRenderers';

jest.mock('@/components/common/PageHeader/RightRenders', () => ({
  MainTypeHeader: () => <div data-testid="main-header" />,
  DetailTypeHeader: () => <div data-testid="detail-header" />,
  WriteTypeHeader: () => <div data-testid="write-header" />,
  MypageTypeHeader: () => <div data-testid="mypage-header" />,
  EditProfileTypeHeader: (props: any) => (
    <div data-testid="editprofile-header">{JSON.stringify(props)}</div>
  ),
}));

describe('PageHeaderRenderers', () => {
  it('main 렌더러가 MainTypeHeader를 반환해야 함', () => {
    const Component = PageHeaderRenderers.main;
    render(<>{Component()}</>);

    expect(screen.getByTestId('main-header')).toBeInTheDocument();
  });

  it('detail 렌더러가 DetailTypeHeader를 반환해야 함', () => {
    const Component = PageHeaderRenderers.detail;
    render(<>{Component()}</>);

    expect(screen.getByTestId('detail-header')).toBeInTheDocument();
  });

  it('write 렌더러가 WriteTypeHeader를 반환해야 함', () => {
    const Component = PageHeaderRenderers.write;
    render(<>{Component()}</>);

    expect(screen.getByTestId('write-header')).toBeInTheDocument();
  });

  it('mypage 렌더러가 MypageTypeHeader를 반환해야 함', () => {
    const Component = PageHeaderRenderers.mypage;
    render(<>{Component()}</>);

    expect(screen.getByTestId('mypage-header')).toBeInTheDocument();
  });

  it('editprofile 렌더러가 EditProfileTypeHeader를 반환해야 함', () => {
    const Component = PageHeaderRenderers.editprofile;
    render(<>{Component({ handleSave: jest.fn(), handleCancel: jest.fn() })}</>);

    expect(screen.getByTestId('editprofile-header')).toBeInTheDocument();
  });
});
