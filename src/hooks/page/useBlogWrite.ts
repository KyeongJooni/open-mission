import { useMemo, useEffect, useRef, useCallback } from 'react';
import type ReactQuill from 'react-quill';
import { useSearchParams } from 'react-router-dom';
import { BLOG_TEXTS } from '@/constants/blog.constants';
import { getEditorStyles } from '@/styles/editor.styles';
import { useImageUpload } from './useImageUpload';
import { useBlogWriteStore } from '@/stores/useBlogWriteStore';
import { useBlogDetailQuery } from '@/api/blog/blogQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { parseApiContentToEditor } from '@/utils/blogContentConverter';

export const useBlogWrite = () => {
  const [searchParams] = useSearchParams();
  const editPostId = searchParams.get('edit');
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  // 에디터 상태 관리
  const {
    title,
    setTitle,
    mode,
    setMode,
    basicContent,
    setBasicContent,
    markdownContent,
    setMarkdownContent,
    setEditPostId,
    reset,
  } = useBlogWriteStore();

  // 수정 모드일 때 블로그 데이터 불러오기
  const { data: blogData } = useBlogDetailQuery(editPostId || undefined, isLoggedIn, Boolean(editPostId));

  // ReactQuill 에디터
  const quillRef = useRef<ReactQuill>(null);

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (editPostId && blogData?.data) {
      const { title: blogTitle, contents } = blogData.data;
      const { content, editorMode } = parseApiContentToEditor(contents);

      setEditPostId(editPostId);
      setTitle(blogTitle);
      setMode(editorMode);

      if (editorMode === 'basic') {
        setBasicContent(content);
      } else {
        setMarkdownContent(content);
      }
    } else if (!editPostId) {
      setEditPostId(null);
    }
  }, [editPostId, blogData, setEditPostId, setTitle, setMode, setBasicContent, setMarkdownContent]);

  // 모바일 기본 모드로 전환
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && mode === 'markdown') {
        setMode('basic');
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mode, setMode]);

  // 페이지 이탈 시 에디터 상태 초기화
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // ReactQuill 모듈 설정
  const modules = useMemo(
    () => ({
      toolbar: [
        BLOG_TEXTS.WRITE.TOOLBAR.HEADERS,
        BLOG_TEXTS.WRITE.TOOLBAR.TEXT_STYLES,
        BLOG_TEXTS.WRITE.TOOLBAR.LISTS,
        BLOG_TEXTS.WRITE.TOOLBAR.LINKS_IMAGES,
        BLOG_TEXTS.WRITE.TOOLBAR.CLEAN,
      ],
    }),
    []
  );

  // 모바일용 툴바 설정
  const mobileModules = useMemo(
    () => ({
      toolbar: {
        container: [['image']],
      },
    }),
    []
  );

  // 에디터 스타일
  const editorStyles = getEditorStyles();

  // 메모이제이션
  const getButtonProps = useCallback(
    (
      targetMode: 'basic' | 'markdown'
    ): {
      intent: 'primary' | 'secondary';
      variant: 'solid' | 'outline';
      size: 'sm';
    } => ({
      intent: mode === targetMode ? 'primary' : 'secondary',
      variant: mode === targetMode ? 'solid' : 'outline',
      size: 'sm',
    }),
    [mode]
  );

  // 이미지 업로드
  const { handleImageUpload, handleImageDrop, handleImagePaste } = useImageUpload({
    mode,
    markdownContent,
    setMarkdownContent,
    quillRef,
  });

  return {
    // 상태
    title,
    setTitle,
    mode,
    setMode,
    basicContent,
    setBasicContent,
    markdownContent,
    setMarkdownContent,

    // Refs
    quillRef,

    // 설정
    modules,
    mobileModules,
    editorStyles,

    // 헬퍼 함수
    getButtonProps,
    handleImageUpload,
    handleImageDrop,
    handleImagePaste,
  };
};
