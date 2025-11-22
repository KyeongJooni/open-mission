import { render, screen } from '@testing-library/react';
import BlogAuthorSection from '../BlogAuthorSection';

jest.mock('@/components', () => ({
  Spacer: () => <div data-testid="spacer" />,
  MyPageHeader: ({ nickname, bio }: any) => (
    <div data-testid="mypage-header">
      <span>{nickname}</span>
      <span>{bio}</span>
    </div>
  ),
}));

describe('BlogAuthorSection', () => {
  it('작성자 닉네임을 렌더링해야 함', () => {
    render(<BlogAuthorSection nickName="테스트 유저" />);

    expect(screen.getByText('테스트 유저')).toBeInTheDocument();
  });

  it('소개글을 렌더링해야 함', () => {
    render(<BlogAuthorSection nickName="테스트 유저" introduction="안녕하세요" />);

    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
  });

  it('소개글이 없을 때 기본 소개글을 표시해야 함', () => {
    render(<BlogAuthorSection nickName="테스트 유저" />);

    expect(screen.getByText('한줄 소개를 입력해주세요')).toBeInTheDocument();
  });

  it('MyPageHeader를 렌더링해야 함', () => {
    render(<BlogAuthorSection nickName="테스트 유저" />);

    expect(screen.getByTestId('mypage-header')).toBeInTheDocument();
  });
});
