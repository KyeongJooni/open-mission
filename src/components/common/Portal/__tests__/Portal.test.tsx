import { render, screen } from '@testing-library/react';
import Portal from '../Portal';

describe('Portal', () => {
  it('children을 document.body에 렌더링해야 함', () => {
    render(
      <Portal>
        <div data-testid="portal-content">포탈 콘텐츠</div>
      </Portal>
    );

    expect(screen.getByTestId('portal-content')).toBeInTheDocument();
    expect(screen.getByText('포탈 콘텐츠')).toBeInTheDocument();
  });

  it('여러 children을 렌더링할 수 있어야 함', () => {
    render(
      <Portal>
        <div data-testid="child-1">첫 번째</div>
        <div data-testid="child-2">두 번째</div>
      </Portal>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
