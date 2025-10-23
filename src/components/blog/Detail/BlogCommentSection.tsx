import { useModalStore } from '@/stores/useModalStore';
import { useBlogComment } from '@/hooks';
import { tv } from 'tailwind-variants';
import { Spacer, CommentItem, CommentInput, Modal } from '@/components';
import { BLOG_TEXTS } from '@/constants';
import { Comment } from '@/types/blog';

interface BlogCommentSectionProps {
  comments: Comment[];
  isLoggedIn?: boolean;
  currentUserNickName?: string;
}

const blogCommentSection = tv({
  slots: {
    container: 'flex flex-col items-center self-stretch',
    header: 'flex w-full max-w-content items-start gap-10 bg-white px-4 pb-3 pt-4',
    headerInner: 'flex flex-1 flex-col items-start gap-10',
    titleWrapper: 'flex items-start gap-2',
    title: 'text-base font-medium text-black',
    count: 'text-base font-regular text-primary',
    noCommentsWrapper: 'flex w-full max-w-content items-center justify-center px-3 py-3',
    noCommentsText: 'flex-1 text-center text-sm font-light text-gray-78',
    commentsList: 'flex w-full max-w-content flex-col items-start gap-2.5',
    loginPromptWrapper: 'flex w-full max-w-content flex-col items-center justify-center gap-2.5 px-4 py-3',
    loginPromptInner: 'flex flex-col items-start gap-2.5 self-stretch rounded border border-gray-90 py-2',
    loginPromptTextWrapper: 'flex w-full items-center justify-center p-3',
    loginPromptText: 'flex h-[66px] flex-1 text-sm font-light text-gray-dark',
  },
});

const BlogCommentSection = ({
  comments: initialComments,
  isLoggedIn = false,
  currentUserNickName = 'User',
}: BlogCommentSectionProps) => {
  const styles = blogCommentSection();
  const { modalType, confirmButtonText, onModalConfirm, openModal, closeModal } = useModalStore();
  const { comments, handleCommentSubmit, handleCommentDeleteClick } = useBlogComment(
    initialComments,
    currentUserNickName
  );

  return (
    <div className={styles.container()} data-comment-section>
      <div className={styles.header()}>
        <div className={styles.headerInner()}>
          <div className={styles.titleWrapper()}>
            <span className={styles.title()}>{BLOG_TEXTS.COMMENTS.TITLE}</span>
            <span className={styles.count()}>{comments.length}</span>
          </div>
        </div>
      </div>
      <Spacer height="sm" className="w-full max-w-content" />
      {comments.length === 0 ? (
        <div className={styles.noCommentsWrapper()}>
          <p className={styles.noCommentsText()}>
            {BLOG_TEXTS.COMMENTS.NO_COMMENTS_LINE1}
            <br />
            {BLOG_TEXTS.COMMENTS.NO_COMMENTS_LINE2}
          </p>
        </div>
      ) : (
        <div className={styles.commentsList()}>
          {comments.map(comment => (
            <CommentItem
              key={comment.commentId}
              commentId={comment.commentId}
              content={comment.content}
              nickName={comment.nickName}
              profileUrl={comment.profileUrl}
              createdAt={comment.createdAt}
              isOwner={comment.isOwner}
              onDelete={handleCommentDeleteClick}
            />
          ))}
        </div>
      )}
      <Spacer height="sm" className="w-full max-w-content" />
      {isLoggedIn ? (
        <CommentInput nickName={currentUserNickName} onSubmit={handleCommentSubmit} />
      ) : (
        <div className={styles.loginPromptWrapper()}>
          <div className={styles.loginPromptInner()}>
            <button type="button" className={styles.loginPromptTextWrapper()} onClick={() => openModal('login')}>
              <p className={styles.loginPromptText()}>{BLOG_TEXTS.COMMENTS.LOGIN_PROMPT}</p>
            </button>
          </div>
        </div>
      )}
      <Spacer height="lg" className="w-full max-w-content" />

      {modalType === 'delete' && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          onDelete={onModalConfirm}
          cancelButtonText={BLOG_TEXTS.COMMENTS.DELETE_MODAL.CANCEL}
          confirmButtonText={confirmButtonText || BLOG_TEXTS.COMMENTS.DELETE_MODAL.CONFIRM}
          confirmButtonVariant="danger"
        >
          <p className="text-sm font-regular text-black">{BLOG_TEXTS.COMMENTS.DELETE_MODAL.TITLE}</p>
        </Modal>
      )}
    </div>
  );
};

export default BlogCommentSection;
