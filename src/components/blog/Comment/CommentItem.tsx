import { memo, useMemo, useCallback } from 'react';
import profileImage from '@/assets/profile.png';
import { PostBody, Spacer, Icon, DropdownMenu } from '@/components';
import { MoreVertIcon } from '@/assets/icons';
import { formatCommentDate } from '@/utils/date';
import { CommentItemProps } from '@/components/blog/Comment/CommentTypes';
import { profileStyles, commentItemStyles } from '@/components/blog/Comment/Comment.styles';
import { useAuthStore } from '@/stores/useAuthStore';

const CommentItem = memo(
  ({ commentId, content, nickName, profileUrl, createdAt, isOwner, onDelete }: CommentItemProps) => {
    const styles = commentItemStyles();
    const profileStyle = profileStyles();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    const handleDelete = useCallback(() => {
      onDelete?.(commentId);
    }, [onDelete, commentId]);

    const dropdownItems = useMemo(
      () => [
        {
          id: 'delete',
          label: '삭제하기',
          onClick: handleDelete,
          color: 'danger' as const,
        },
      ],
      [handleDelete]
    );

    return (
      <div className={styles.container()}>
        <div className={styles.header()}>
          <div className={styles.headerContent()}>
            <div className={styles.headerLayout()}>
              <div className={profileStyle.profileSection()}>
                <div className={profileStyle.profileImageWrapper()}>
                  <img src={profileUrl || profileImage} alt="profile" className={profileStyle.profileImage()} />
                </div>
                <div className={profileStyle.userInfo()}>
                  <span className={profileStyle.nickName()}>{nickName}</span>
                  <span className={styles.date()}>{formatCommentDate(createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          {isLoggedIn && isOwner && (
            <DropdownMenu
              trigger={
                <Icon size="md" clickable>
                  <MoreVertIcon />
                </Icon>
              }
              items={dropdownItems}
              position="right"
            />
          )}
        </div>
        <div className={styles.contentWrapper()}>
          <PostBody content={content} />
        </div>
        <Spacer height="sm" className="w-full" />
      </div>
    );
  }
);

CommentItem.displayName = 'CommentItem';

export default CommentItem;
