import { tv } from 'tailwind-variants';
import Button from '@/components/common/Button/Button';
import { BLOG_TEXTS } from '@/constants/blog.constants';
import type { EditorMode } from '@/types/blog';

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

interface ModeToggleButtonsProps {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  getButtonProps: (targetMode: 'basic' | 'markdown') => {
    intent: 'primary' | 'secondary';
    variant: 'solid' | 'outline';
    size: 'sm';
  };
}

const titleInputVariants = tv({
  base: [
    'w-full bg-transparent outline-none self-stretch',
    'text-2xl font-medium leading-[160%] tracking-[-0.08px]',
    'text-black placeholder:text-gray-56',
    'overflow-hidden text-ellipsis whitespace-nowrap',
  ],
});

// ModeToggleButtons 스타일 variants
const modeToggleVariants = tv({
  slots: {
    container: 'flex gap-2 mb-4',
    markdownButton: 'hidden md:inline-flex',
  },
});

// TitleInput 컴포넌트
export const TitleInput = ({ title, setTitle }: TitleInputProps) => {
  return (
    <input
      type="text"
      placeholder={BLOG_TEXTS.WRITE.PLACEHOLDERS.TITLE}
      value={title}
      onChange={e => setTitle(e.target.value)}
      className={titleInputVariants()}
    />
  );
};

// ModeToggleButtons 컴포넌트
export const ModeToggleButtons = ({ setMode, getButtonProps }: ModeToggleButtonsProps) => {
  const styles = modeToggleVariants();

  return (
    <div className={styles.container()}>
      <Button onClick={() => setMode('basic')} {...getButtonProps('basic')}>
        {BLOG_TEXTS.WRITE.MODES.BASIC}
      </Button>

      <Button onClick={() => setMode('markdown')} {...getButtonProps('markdown')} className={styles.markdownButton()}>
        {BLOG_TEXTS.WRITE.MODES.MARKDOWN}
      </Button>
    </div>
  );
};
