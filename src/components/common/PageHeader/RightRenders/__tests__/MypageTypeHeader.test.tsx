import { render } from '@testing-library/react';
import { MypageTypeHeader } from '../MypageTypeHeader';

describe('MypageTypeHeader', () => {
  it('null을 반환해야 함', () => {
    const { container } = render(<MypageTypeHeader />);

    expect(container.firstChild).toBeNull();
  });
});
