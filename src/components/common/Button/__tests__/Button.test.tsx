import { render, screen, fireEvent } from '@/test-utils';
import Button from '../Button';

describe('Button', () => {
  describe('렌더링', () => {
    it('children을 렌더링해야 함', () => {
      render(<Button>클릭</Button>);
      expect(screen.getByText('클릭')).toBeInTheDocument();
    });

    it('기본 type은 button이어야 함', () => {
      render(<Button>버튼</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('submit type을 설정할 수 있어야 함', () => {
      render(<Button type="submit">제출</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('클릭 이벤트', () => {
    it('onClick 핸들러가 호출되어야 함', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>클릭</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('onClick이 없어도 에러가 발생하지 않아야 함', () => {
      render(<Button>클릭</Button>);

      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
  });

  describe('아이콘', () => {
    it('showIcon이 true이고 icon이 있으면 아이콘을 표시해야 함', () => {
      render(
        <Button showIcon icon={<span data-testid="icon">아이콘</span>}>
          버튼
        </Button>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('showIcon이 false면 아이콘을 표시하지 않아야 함', () => {
      render(
        <Button showIcon={false} icon={<span data-testid="icon">아이콘</span>}>
          버튼
        </Button>
      );

      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('스타일 variants', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<Button className="custom-class">버튼</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });
});
