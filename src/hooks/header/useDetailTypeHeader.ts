import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { PAGEHEADER_TEXTS, ROUTES } from '@/constants';
import { useDeleteBlogMutation } from '@/api/blog/blogQuery';
import type { DetailTypeHeaderReturn } from '@/types/pageheader';

//DetailTypeHeader 비즈니스 로직
export const useDetailTypeHeader = (): DetailTypeHeaderReturn => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const deleteBlogMutation = useDeleteBlogMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //댓글 섹션으로 스크롤
  const handleChatClick = () => {
    const commentSection = document.querySelector('[data-comment-section]');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  //  수정하기 버튼 클릭 핸들러
  const handleEdit = () => {
    if (!id) {
      showToast(PAGEHEADER_TEXTS.DETAIL.TOAST.NO_ID, 'warning');
      return;
    }
    navigate(ROUTES.BLOG.EDIT(id));
  };

  //삭제버튼 클릭 핸들러
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  //삭제 확인 핸들러
  const handleConfirmDelete = async () => {
    if (!id) {
      showToast(PAGEHEADER_TEXTS.DETAIL.TOAST.NO_ID, 'warning');
      return;
    }

    try {
      await deleteBlogMutation.mutateAsync(id);
      showToast(PAGEHEADER_TEXTS.DETAIL.TOAST.DELETE_SUCCESS, 'positive');
      setIsDeleteModalOpen(false);
      navigate(ROUTES.HOME);
    } catch {
      showToast(PAGEHEADER_TEXTS.DETAIL.TOAST.DELETE_FAILED, 'warning');
    }
  };

  //삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return {
    handleChatClick,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    isDeleteModalOpen,
    modalTexts: {
      confirm: PAGEHEADER_TEXTS.DETAIL.MODAL.CONFIRM,
      cancel: PAGEHEADER_TEXTS.DETAIL.MODAL.CANCEL,
      deleteTitle: PAGEHEADER_TEXTS.DETAIL.MODAL.DELETE_TITLE,
      deleteDescription: PAGEHEADER_TEXTS.DETAIL.MODAL.DELETE_DESCRIPTION,
    },
  };
};
