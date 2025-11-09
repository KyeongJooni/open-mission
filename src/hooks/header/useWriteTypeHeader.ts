import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/stores/useModalStore';
import { useBlogWriteStore } from '@/stores/useBlogWriteStore';
import { useToast } from '@/contexts/ToastContext';
import { PAGEHEADER_TEXTS, ROUTES } from '@/constants';
import { convertToApiFormat } from '@/utils/blogContentParser';
import { useCreateBlogMutation, useUpdateBlogMutation } from '@/api/blog/blogQuery';

//컴포넌트 비즈니스 로직
export const useWriteTypeHeader = () => {
  const navigate = useNavigate();
  const { modalType, confirmButtonText, onModalConfirm, openModal, closeModal } = useModalStore();
  const { title, getCurrentContent, reset, editPostId } = useBlogWriteStore();
  const { showToast } = useToast();
  const createBlogMutation = useCreateBlogMutation();
  const updateBlogMutation = useUpdateBlogMutation();

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    openModal(
      'delete',
      undefined,
      () => {
        reset();
        closeModal();
        navigate(-1);
      },
      PAGEHEADER_TEXTS.WRITE.MODAL.CONFIRM
    );
  };

  //게시 버튼 클릭 핸들러
  const handlePublishClick = async () => {
    const content = getCurrentContent();
    const { mode } = useBlogWriteStore.getState();

    if (!title.trim() && !content.trim()) {
      showToast(PAGEHEADER_TEXTS.WRITE.TOAST.EMPTY_CONTENT, 'warning');
      return;
    }

    if (!title.trim()) {
      showToast(PAGEHEADER_TEXTS.WRITE.TOAST.EMPTY_TITLE, 'warning');
      return;
    }

    if (!content.trim()) {
      showToast(PAGEHEADER_TEXTS.WRITE.TOAST.EMPTY_CONTENT, 'warning');
      return;
    }

    const payload = convertToApiFormat(title, content, mode === 'markdown');

    try {
      if (editPostId) {
        await updateBlogMutation.mutateAsync({
          blogId: editPostId,
          blogData: payload,
        });
        showToast(PAGEHEADER_TEXTS.WRITE.TOAST.UPDATE_SUCCESS, 'positive');
      } else {
        await createBlogMutation.mutateAsync(payload);
        showToast(PAGEHEADER_TEXTS.WRITE.TOAST.CREATE_SUCCESS, 'positive');
      }

      reset();
      navigate(editPostId ? ROUTES.BLOG.DETAIL(editPostId) : ROUTES.HOME);
    } catch {
      showToast(PAGEHEADER_TEXTS.WRITE.TOAST.SERVER_ERROR, 'warning');
    }
  };

  return {
    // 핸들러
    handleDeleteClick,
    handlePublishClick,
    // 모달 상태
    modalType,
    confirmButtonText,
    onModalConfirm,
    closeModal,
  };
};
