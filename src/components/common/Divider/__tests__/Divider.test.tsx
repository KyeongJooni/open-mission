import { render } from '@testing-library/react';
import Divider from '../Divider';

describe('Divider', () => {
  it('div 요소를 렌더링해야 함', () => {
    const { container } = render(<Divider />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('기본 스타일 클래스를 가져야 함', () => {
    const { container } = render(<Divider />);

    expect(container.firstChild).toHaveClass('h-px');
    expect(container.firstChild).toHaveClass('bg-gray-96');
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<Divider className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
