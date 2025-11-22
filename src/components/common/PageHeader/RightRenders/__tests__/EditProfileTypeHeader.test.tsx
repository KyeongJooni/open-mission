import { render, screen, fireEvent } from '@testing-library/react';
import { EditProfileTypeHeader } from '../EditProfileTypeHeader';

jest.mock('@/stores/useEditModeStore', () => ({
  useEditModeStore: jest.fn(),
}));

describe('EditProfileTypeHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('편집 모드가 아닐 때 수정 버튼을 표시해야 함', () => {
    const { useEditModeStore } = require('@/stores/useEditModeStore');
    useEditModeStore.mockImplementation((selector: any) => selector({ isEditMode: false }));

    render(<EditProfileTypeHeader />);

    expect(screen.getByText('수정하기')).toBeInTheDocument();
  });

  it('편집 모드일 때 취소/저장 버튼을 표시해야 함', () => {
    const { useEditModeStore } = require('@/stores/useEditModeStore');
    useEditModeStore.mockImplementation((selector: any) => selector({ isEditMode: true }));

    render(<EditProfileTypeHeader />);

    expect(screen.getByText('취소하기')).toBeInTheDocument();
    expect(screen.getByText('저장하기')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 onEdit을 호출해야 함', () => {
    const { useEditModeStore } = require('@/stores/useEditModeStore');
    useEditModeStore.mockImplementation((selector: any) => selector({ isEditMode: false }));

    const onEdit = jest.fn();
    render(<EditProfileTypeHeader onEdit={onEdit} />);

    fireEvent.click(screen.getByText('수정하기'));

    expect(onEdit).toHaveBeenCalled();
  });

  it('취소 버튼 클릭 시 onCancel을 호출해야 함', () => {
    const { useEditModeStore } = require('@/stores/useEditModeStore');
    useEditModeStore.mockImplementation((selector: any) => selector({ isEditMode: true }));

    const onCancel = jest.fn();
    render(<EditProfileTypeHeader onCancel={onCancel} />);

    fireEvent.click(screen.getByText('취소하기'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('저장 버튼은 submit 타입이어야 함', () => {
    const { useEditModeStore } = require('@/stores/useEditModeStore');
    useEditModeStore.mockImplementation((selector: any) => selector({ isEditMode: true }));

    render(<EditProfileTypeHeader />);

    const saveButton = screen.getByText('저장하기').closest('button');
    expect(saveButton).toHaveAttribute('type', 'submit');
  });
});
