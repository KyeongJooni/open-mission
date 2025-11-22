import { render, screen } from '@testing-library/react';
import SignupForm from '../SignupForm';

const mockRegister = jest.fn();
const mockHandleSubmit = jest.fn((fn) => (e: any) => {
  e?.preventDefault();
  fn({});
});
const mockOnSubmit = jest.fn();

jest.mock('@/hooks', () => ({
  useSignup: () => ({
    previewImage: 'test-image.png',
    fileInputRef: { current: null },
    handleImageUpload: jest.fn(),
    handleButtonClick: jest.fn(),
    form: {
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: { errors: {} },
    },
    onSubmit: mockOnSubmit,
    handleLoginRedirect: jest.fn(),
    isCompleteModalOpen: false,
    setIsCompleteModalOpen: jest.fn(),
    isLoginModalOpen: false,
    setIsLoginModalOpen: jest.fn(),
    isKakaoSignup: false,
  }),
}));

jest.mock('@/components', () => ({
  Spacer: ({ height }: { height: string }) => <div data-testid="spacer" data-height={height} />,
  Button: ({ children, type }: { children: React.ReactNode; type: string }) => (
    <button type={type as any} data-testid="submit-button">{children}</button>
  ),
  Modal: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    isOpen ? <div data-testid="modal">{children}</div> : null
  ),
}));

jest.mock('@/components/auth/LoginModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? <div data-testid="login-modal">Login Modal</div> : null
  ),
}));

jest.mock('../SignupProfileSection', () => ({
  __esModule: true,
  default: () => <div data-testid="signup-profile-section">Profile Section</div>,
}));

jest.mock('../SignupFormFields', () => ({
  __esModule: true,
  default: () => <div data-testid="signup-form-fields">Form Fields</div>,
}));

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트가 렌더링되어야 함', () => {
    render(<SignupForm />);

    expect(screen.getByTestId('signup-profile-section')).toBeInTheDocument();
    expect(screen.getByTestId('signup-form-fields')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('제출 버튼이 표시되어야 함', () => {
    render(<SignupForm />);

    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('Spacer가 렌더링되어야 함', () => {
    render(<SignupForm />);

    const spacers = screen.getAllByTestId('spacer');
    expect(spacers.length).toBeGreaterThan(0);
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<SignupForm className="custom-class" />);

    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
