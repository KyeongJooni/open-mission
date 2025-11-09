import { useToast } from '@/contexts/ToastContext';
import { useModalStore } from '@/stores/useModalStore';
import type { Comment } from '@/types/blog';
import { useParams } from 'react-router-dom';
import { useCreateCommentMutation, useDeleteCommentMutation } from '@/api/comment/commentQuery';

//비즈니스 로직
export const useBlogComment = (comments: Comment[], _currentUserNickName: string) => {
  const { showToast } = useToast();
  const { openModal, closeModal } = useModalStore();
  const { id } = useParams();
  const createCommentMutation = useCreateCommentMutation(id || '');
  const deleteCommentMutation = useDeleteCommentMutation(id || '');

  // 댓글 등록
  const handleCommentSubmit = async (content: string) => {
    if (!id) {
      showToast('게시글 정보가 없습니다', 'warning');
      return;
    }

    try {
      await createCommentMutation.mutateAsync(content);
      showToast('댓글이 작성되었습니다', 'positive');
    } catch {
      showToast('댓글 작성에 실패했습니다', 'warning');
    }
  };

  // 댓글 삭제 모달 열기
  const handleCommentDeleteClick = (commentId: number) => {
    openModal('delete', undefined, () => confirmCommentDelete(commentId), '삭제하기');
  };

  // 댓글 삭제 확인
  const confirmCommentDelete = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      showToast('댓글이 삭제되었습니다', 'positive');
      closeModal();
    } catch {
      showToast('댓글 삭제에 실패했습니다', 'warning');
      closeModal();
    }
  };

  return {
    comments,
    handleCommentSubmit,
    handleCommentDeleteClick,
  };
};
