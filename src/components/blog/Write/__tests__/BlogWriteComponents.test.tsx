import { render, screen, fireEvent } from '@testing-library/react';
import { TitleInput, ModeToggleButtons } from '../BlogWriteComponents';

jest.mock('@/components/common/Button/Button', () => ({ children, onClick, ...props }: any) => (
  <button onClick={onClick} data-intent={props.intent} data-variant={props.variant}>
    {children}
  </button>
));

describe('TitleInput', () => {
  it('입력창을 렌더링해야 함', () => {
    render(<TitleInput title="" setTitle={() => {}} />);

    expect(screen.getByPlaceholderText('제목')).toBeInTheDocument();
  });

  it('value를 표시해야 함', () => {
    render(<TitleInput title="테스트 제목" setTitle={() => {}} />);

    expect(screen.getByDisplayValue('테스트 제목')).toBeInTheDocument();
  });

  it('입력 시 setTitle을 호출해야 함', () => {
    const setTitle = jest.fn();
    render(<TitleInput title="" setTitle={setTitle} />);

    fireEvent.change(screen.getByPlaceholderText('제목'), {
      target: { value: '새 제목' },
    });

    expect(setTitle).toHaveBeenCalledWith('새 제목');
  });
});

describe('ModeToggleButtons', () => {
  const defaultProps = {
    mode: 'basic' as const,
    setMode: jest.fn(),
    getButtonProps: (targetMode: 'basic' | 'markdown') => ({
      intent: targetMode === 'basic' ? 'primary' as const : 'secondary' as const,
      variant: targetMode === 'basic' ? 'solid' as const : 'outline' as const,
      size: 'sm' as const,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('기본 모드 버튼을 렌더링해야 함', () => {
    render(<ModeToggleButtons {...defaultProps} />);

    expect(screen.getByText('기본모드')).toBeInTheDocument();
  });

  it('마크다운 모드 버튼을 렌더링해야 함', () => {
    render(<ModeToggleButtons {...defaultProps} />);

    expect(screen.getByText('마크다운')).toBeInTheDocument();
  });

  it('기본 버튼 클릭 시 setMode("basic")을 호출해야 함', () => {
    const setMode = jest.fn();
    render(<ModeToggleButtons {...defaultProps} setMode={setMode} />);

    fireEvent.click(screen.getByText('기본모드'));

    expect(setMode).toHaveBeenCalledWith('basic');
  });

  it('마크다운 버튼 클릭 시 setMode("markdown")을 호출해야 함', () => {
    const setMode = jest.fn();
    render(<ModeToggleButtons {...defaultProps} setMode={setMode} />);

    fireEvent.click(screen.getByText('마크다운'));

    expect(setMode).toHaveBeenCalledWith('markdown');
  });
});
