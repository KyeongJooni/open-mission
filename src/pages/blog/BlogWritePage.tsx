import ReactQuill from 'react-quill';
import MDEditor from '@uiw/react-md-editor';
import { tv } from 'tailwind-variants';
import { Spacer, PostCard, PageHeaderLegacy } from '@/components';
import { BLOG_TEXTS, BLOG_STYLES } from '@/constants/blog.constants';
import { useBlogWrite, useIsMobile } from '@/hooks';
import { TitleInput, ModeToggleButtons } from '@/components/blog/Write';
import 'react-quill/dist/quill.snow.css';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const blogWriteStyles = tv({
  slots: {
    container: 'flex flex-col items-center self-stretch',
    headerContainer: 'flex flex-col items-center self-stretch border-b border-gray-96 bg-white',
    editorContainer: 'flex w-full max-w-content p-3 px-4 justify-start items-center gap-2 self-stretch',
    editorWrapper: 'flex w-full',
  },
});

const BlogWritePage = () => {
  const {
    title,
    setTitle,
    mode,
    setMode,
    basicContent,
    setBasicContent,
    markdownContent,
    setMarkdownContent,
    modules,
    mobileModules,
    editorStyles,
    getButtonProps,
    quillRef,
  } = useBlogWrite();

  const isMobile = useIsMobile();
  const styles = blogWriteStyles();

  return (
    <div>
      <style>{editorStyles}</style>
      <PageHeaderLegacy />

      <div className={styles.headerContainer()}>
        <Spacer height="md" />
        <PostCard className="w-full" title="" renderTitle={<TitleInput title={title} setTitle={setTitle} />} />
        <Spacer height="md" />
      </div>

      <div className={styles.container()}>
        <Spacer height="md" />
        {!isMobile && <ModeToggleButtons mode={mode} setMode={setMode} getButtonProps={getButtonProps} />}

        <div className={styles.editorContainer()}>
          {isMobile ? (
            <div className={styles.editorWrapper()}>
              <div className="m-mobile-quill w-full max-w-content">
                <ReactQuill
                  ref={quillRef}
                  value={basicContent}
                  onChange={setBasicContent}
                  modules={mobileModules}
                  placeholder={BLOG_TEXTS.WRITE.PLACEHOLDERS.CONTENT}
                  className="mobile-quill w-full"
                  theme="snow"
                />
              </div>
            </div>
          ) : (
            <>
              {mode === 'basic' ? (
                <div className="desktop-quill w-full">
                  <ReactQuill
                    ref={quillRef}
                    value={basicContent}
                    onChange={setBasicContent}
                    modules={modules}
                    placeholder={BLOG_TEXTS.WRITE.PLACEHOLDERS.CONTENT}
                    theme="snow"
                  />
                </div>
              ) : (
                <div className={styles.editorWrapper()}>
                  <MDEditor
                    value={markdownContent}
                    onChange={val => setMarkdownContent(val || '')}
                    height={parseInt(BLOG_STYLES.EDITOR.HEIGHT)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Spacer height="lg" />
    </div>
  );
};

export default BlogWritePage;
