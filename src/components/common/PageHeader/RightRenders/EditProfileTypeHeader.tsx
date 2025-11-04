import { useEditModeStore } from '@/stores/useEditModeStore';
import { PAGEHEADER_TEXTS } from '@/constants';

interface EditProfileTypeHeaderProps {
  onEdit?: () => void;
  onCancel?: () => void;
}

export const EditProfileTypeHeader = ({ onEdit, onCancel }: EditProfileTypeHeaderProps) => {
  const isEditMode = useEditModeStore(state => state.isEditMode);

  if (!isEditMode) {
    return (
      <button type="button" onClick={onEdit} className="flex items-center justify-center gap-1 px-3 py-2">
        <span className="text-sm font-regular text-black">{PAGEHEADER_TEXTS.EDIT_PROFILE.EDIT_BUTTON}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <button type="button" onClick={onCancel} className="flex items-center justify-center gap-1 px-3 py-2">
        <span className="text-sm font-regular text-warning">{PAGEHEADER_TEXTS.EDIT_PROFILE.CANCEL_BUTTON}</span>
      </button>
      <button type="submit" form="edit-profile-form" className="flex items-center justify-center gap-1 px-3 py-2">
        <span className="text-sm font-regular text-black">{PAGEHEADER_TEXTS.EDIT_PROFILE.SAVE_BUTTON}</span>
      </button>
    </div>
  );
};
