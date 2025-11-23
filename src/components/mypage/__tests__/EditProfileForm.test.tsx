import { render, screen } from '@testing-library/react';
import EditProfileForm from '../EditProfileForm';

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(() => ({})),
    handleSubmit: (fn: any) => (e: any) => {
      e?.preventDefault?.();
      fn({});
    },
    formState: { errors: {} },
    reset: jest.fn(),
  }),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

jest.mock('@/api/user/userQuery', () => ({
  useAuth: () => ({
    user: {
      email: 'test@example.com',
      name: '테스트',
      birthDate: '1990-01-01',
      nickname: 'testuser',
      introduction: '소개',
    },
  }),
}));

jest.mock('@/stores/useEditModeStore', () => ({
  useEditModeStore: () => ({
    isEditMode: false,
    setEditMode: jest.fn(),
  }),
}));

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(selector => selector({ isKakaoUser: false })),
}));

jest.mock('react-router-dom', () => ({
  useOutletContext: () => ({
    headerNickname: 'testuser',
    headerIntroduction: '소개',
    handleSave: jest.fn(),
  }),
}));

jest.mock('@/components', () => ({
  Spacer: () => <div data-testid="spacer" />,
  Textarea: ({ title, disabled }: any) => (
    <div data-testid={`textarea-${title}`} data-disabled={disabled}>
      {title}
    </div>
  ),
}));

describe('EditProfileForm', () => {
  it('폼을 렌더링해야 함', () => {
    const { container } = render(<EditProfileForm />);

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('Spacer를 렌더링해야 함', () => {
    render(<EditProfileForm />);

    expect(screen.getAllByTestId('spacer').length).toBeGreaterThan(0);
  });

  it('className을 적용해야 함', () => {
    const { container } = render(<EditProfileForm className="custom-class" />);

    expect(container.querySelector('form')).toHaveClass('custom-class');
  });
});
