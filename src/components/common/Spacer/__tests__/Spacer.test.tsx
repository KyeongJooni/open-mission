import { render } from '@testing-library/react';
import Spacer from '../Spacer';

describe('Spacer', () => {
  it('div 요소를 렌더링해야 함', () => {
    const { container } = render(<Spacer />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('기본 height가 sm이어야 함', () => {
    const { container } = render(<Spacer />);

    expect(container.firstChild).toHaveClass('h-5');
  });

  it('height="md"일 때 h-8 클래스를 가져야 함', () => {
    const { container } = render(<Spacer height="md" />);

    expect(container.firstChild).toHaveClass('h-8');
  });

  it('height="custom"일 때 h-14 클래스를 가져야 함', () => {
    const { container } = render(<Spacer height="custom" />);

    expect(container.firstChild).toHaveClass('h-14');
  });

  it('height="lg"일 때 h-16 클래스를 가져야 함', () => {
    const { container } = render(<Spacer height="lg" />);

    expect(container.firstChild).toHaveClass('h-16');
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<Spacer className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
