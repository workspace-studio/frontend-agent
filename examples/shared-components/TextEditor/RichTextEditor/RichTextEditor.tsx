import { forwardRef, useCallback, useEffect, useState } from 'react';

import { Backdrop, FormHelperText, Portal, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, Extensions, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import cx from 'clsx';

import EditorToolbar from '@/components/TextEditor/EditorToolbar';
import { ToolbarConfig } from '@/config/rich-text-editor.config';

import styles from './RichTextEditor.module.scss';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  editable?: boolean;
  sx?: SxProps<Theme>;
  slotProps?: {
    wrap?: SxProps<Theme>;
  };
  extensions?: Extensions;
  toolbarConfig?: ToolbarConfig;
  editorOptions?: {
    autofocus?: boolean | 'start' | 'end' | 'all';
    enablePasteRules?: boolean;
    enableInputRules?: boolean;
    injectCSS?: boolean;
  };
  onEditorReady?: (editor: ReturnType<typeof useEditor>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const getDefaultExtensions = (placeholder?: string): Extensions => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    codeBlock: false,
    link: false,
    underline: false,
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link.configure({
    autolink: true,
    openOnClick: false,
    HTMLAttributes: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'editor-image',
    },
  }),
  Placeholder.configure({
    placeholder,
  }),
];

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value = '',
      onChange,
      placeholder,
      error = false,
      helperText,
      editable = true,
      slotProps,
      extensions: customExtensions,
      toolbarConfig,
      editorOptions = {
        autofocus: editable ? 'end' : false,
        enablePasteRules: true,
        enableInputRules: true,
        injectCSS: true,
      },
      onEditorReady,
      onBlur,
      onFocus,
    },
    ref
  ) => {
    const [fullScreen, setFullScreen] = useState(false);
    const [activeMarks, setActiveMarks] = useState<Set<string>>(new Set());

    const handleToggleFullScreen = useCallback(() => {
      setFullScreen(prev => !prev);
    }, []);

    const updateActiveMarks = (ed: typeof editor) => {
      const marks = new Set<string>();

      ['bold', 'italic', 'underline', 'strike', 'code'].forEach(mark => {
        if (ed?.isActive(mark)) marks.add(mark);
      });
      setActiveMarks(marks);
    };

    const finalExtensions = customExtensions || getDefaultExtensions(placeholder);

    const editor = useEditor({
      content: value || '<p></p>',
      editable,
      immediatelyRender: false,
      autofocus: editorOptions.autofocus,
      extensions: finalExtensions,
      enablePasteRules: editorOptions.enablePasteRules,
      enableInputRules: editorOptions.enableInputRules,
      injectCSS: editorOptions.injectCSS,
      onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();

        onChange?.(html);
        updateActiveMarks(ed);
      },
      onSelectionUpdate: ({ editor: ed }) => {
        updateActiveMarks(ed);
      },
      onTransaction: ({ editor: ed }) => {
        updateActiveMarks(ed);
      },
      onBlur: () => {
        onBlur?.();
      },
      onFocus: () => {
        onFocus?.();
      },
    });

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    useEffect(() => {
      if (editor) {
        onEditorReady?.(editor);
      }
    }, [editor, onEditorReady]);

    useEffect(() => {
      if (fullScreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [fullScreen]);

    if (!editor) {
      return null;
    }

    return (
      <Portal disablePortal={!fullScreen}>
        {fullScreen && <Backdrop open sx={{ zIndex: theme => theme.zIndex.modal - 1 }} />}
        <Stack sx={{ ...(!editable && { cursor: 'not-allowed' }), ...slotProps?.wrap }}>
          <Stack
            direction="column"
            className={cx(
              styles.root,
              error && styles.error,
              !editable && styles.disabled,
              fullScreen && styles.fullScreen
            )}
          >
            <EditorToolbar
              editor={editor}
              fullScreen={fullScreen}
              activeMarks={activeMarks}
              onToggleFullScreen={handleToggleFullScreen}
              toolbarConfig={toolbarConfig}
            />
            <EditorContent
              ref={ref}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              editor={editor}
              className={cx(styles.editorContentWrapper, fullScreen && styles.fullScreen)}
            />
          </Stack>
          {helperText && (
            <FormHelperText error={error} sx={{ px: 2, mt: 0.5 }}>
              {helperText}
            </FormHelperText>
          )}
        </Stack>
      </Portal>
    );
  }
);

export default RichTextEditor;
