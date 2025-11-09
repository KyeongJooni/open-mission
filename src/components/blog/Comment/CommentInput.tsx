import { useState } from 'react';
import profileImage from '@/assets/profile.png';
import { PostInput, Button } from '@/components';
import { BLOG_TEXTS } from '@/constants';
import { CommentInputProps } from '@/components/blog/Comment/CommentTypes';
import { profileStyles, commentInputStyles } from '@/components/blog/Comment/Comment.styles';

const CommentInput = ({ nickName, profileUrl, onSubmit }: CommentInputProps) => {
  const [comment, setComment] = useState('');
  const hasContent = comment.trim().length > 0;

  const styles = commentInputStyles();
  const profileStyle = profileStyles();

  const handleSubmit = () => {
    if (!hasContent) {
      return;
    }
    if (onSubmit) {
      onSubmit(comment);
      setComment(''); // 입력창 초기화
    }
  };

  return (
    <div className={styles.container()}>
      <div className={styles.inputWrapper()}>
        <div className={styles.contentLayout()}>
          <div className={profileStyle.profileSection()}>
            <div className={profileStyle.profileImageWrapper()}>
              <img src={profileUrl || profileImage} alt="profile" className={profileStyle.profileImage()} />
            </div>
            <div className={profileStyle.userInfo()}>
              <span className={profileStyle.nickName()}>{nickName}</span>
            </div>
          </div>
        </div>
        <PostInput value={comment} onChange={setComment} placeholder={BLOG_TEXTS.COMMENTS.INPUT_PLACEHOLDER} />
        <div className={styles.buttonWrapper()}>
          <Button intent="gray" variant={hasContent ? 'solid' : 'outline'} size="comment" onClick={handleSubmit}>
            {BLOG_TEXTS.COMMENTS.SUBMIT_BUTTON}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
