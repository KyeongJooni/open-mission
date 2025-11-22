import { render, screen, fireEvent } from '@testing-library/react';
import Icon from '../Icon';

describe('Icon', () => {
  it('children을 렌더링해야 함', () => {
    render(
      <Icon>
        <svg data-testid="test-icon" />
      </Icon>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('onClick이 제공되면 클릭 가능해야 함', () => {
    const onClick = jest.fn();
    render(
      <Icon onClick={onClick}>
        <svg data-testid="test-icon" />
      </Icon>
    );

    fireEvent.click(screen.getByTestId('test-icon').parentElement!.parentElement!);
    expect(onClick).toHaveBeenCalled();
  });

  it('clickable prop이 true일 때 클릭 가능한 스타일을 적용해야 함', () => {
    const { container } = render(
      <Icon clickable>
        <svg data-testid="test-icon" />
      </Icon>
    );

    expect(container.firstChild).toHaveClass('cursor-pointer');
  });

  it('className을 적용해야 함', () => {
    render(
      <Icon className="custom-class">
        <svg data-testid="test-icon" />
      </Icon>
    );

    const iconInner = screen.getByTestId('test-icon').parentElement;
    expect(iconInner).toHaveClass('custom-class');
  });

  it('containerClassName을 적용해야 함', () => {
    const { container } = render(
      <Icon containerClassName="container-class">
        <svg data-testid="test-icon" />
      </Icon>
    );

    expect(container.firstChild).toHaveClass('container-class');
  });

  it('size prop에 따라 다른 크기를 적용해야 함', () => {
    const { rerender, container } = render(
      <Icon size="sm">
        <svg data-testid="test-icon" />
      </Icon>
    );

    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <Icon size="lg">
        <svg data-testid="test-icon" />
      </Icon>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
