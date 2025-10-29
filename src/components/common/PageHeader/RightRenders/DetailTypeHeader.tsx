import { ChatIcon, MoreVertIcon } from '@/assets/icons';
import { Icon, DropdownMenu, Modal } from '@/components';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDetailTypeHeader } from '@/hooks';
import { PAGEHEADER_TEXTS } from '@/constants';

interface DetailTypeHeaderProps {
  isOwner?: boolean;
}

export const DetailTypeHeader = ({ isOwner = false }: DetailTypeHeaderProps) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const {
    handleChatClick,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    isDeleteModalOpen,
    modalTexts,
  } = useDetailTypeHeader();

  const dropdownItems = [
    {
      id: 'edit',
      label: PAGEHEADER_TEXTS.DETAIL.DROPDOWN.EDIT,
      onClick: handleEdit,
    },
    {
      id: 'delete',
      label: PAGEHEADER_TEXTS.DETAIL.DROPDOWN.DELETE,
      onClick: handleDelete,
      color: 'danger' as const,
    },
  ];

  const canEdit = isLoggedIn && isOwner;

  return (
    <>
      <div className="flex items-center gap-2">
        <Icon size="lg" clickable onClick={handleChatClick}>
          <ChatIcon />
        </Icon>
        {canEdit ? (
          <DropdownMenu
            trigger={
              <Icon size="lg" clickable>
                <MoreVertIcon />
              </Icon>
            }
            items={dropdownItems}
            position="right"
          />
        ) : (
          <Icon size="lg" className="cursor-not-allowed opacity-100">
            <MoreVertIcon />
          </Icon>
        )}
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
        confirmButtonText={modalTexts.confirm}
        cancelButtonText={modalTexts.cancel}
        confirmButtonVariant="danger"
      >
        <div className="flex flex-col items-start gap-2">
          <p className="text-base font-medium text-black">{modalTexts.deleteTitle}</p>
          <p className="text-sm font-light text-gray-56">{modalTexts.deleteDescription}</p>
        </div>
      </Modal>
    </>
  );
};
