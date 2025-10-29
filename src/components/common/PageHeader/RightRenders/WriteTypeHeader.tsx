import { Modal } from '@/components';
import { PAGEHEADER_TEXTS } from '@/constants';
import { useWriteTypeHeader } from '@/hooks';

export const WriteTypeHeader = () => {
  const { handleDeleteClick, handlePublishClick, modalType, confirmButtonText, onModalConfirm, closeModal } =
    useWriteTypeHeader();

  return (
    <>
      <div className="flex items-center gap-2.5">
        <button type="button" className="flex items-center justify-center gap-1 px-3 py-2" onClick={handleDeleteClick}>
          <span className="text-sm font-regular text-warning">{PAGEHEADER_TEXTS.WRITE.DELETE_BUTTON}</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-1 px-3 py-2" onClick={handlePublishClick}>
          <span className="text-sm font-regular text-black">{PAGEHEADER_TEXTS.WRITE.PUBLISH_BUTTON}</span>
        </button>
      </div>

      {modalType === 'delete' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          onDelete={onModalConfirm}
          cancelButtonText={PAGEHEADER_TEXTS.WRITE.MODAL.CANCEL}
          confirmButtonText={confirmButtonText || PAGEHEADER_TEXTS.WRITE.MODAL.CONFIRM}
          confirmButtonVariant="danger"
        >
          <p className="text-sm font-regular text-black">{PAGEHEADER_TEXTS.WRITE.MODAL.DELETE_TITLE}</p>
          <p className="text-xs font-regular text-gray">{PAGEHEADER_TEXTS.WRITE.MODAL.DELETE_DESCRIPTION}</p>
        </Modal>
      )}
    </>
  );
};
