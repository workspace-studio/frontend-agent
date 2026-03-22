import { forwardRef } from 'react';

import { FormControl, FormLabel } from '@mui/material';
import { Extensions } from '@tiptap/react';

import { ToolbarConfig } from '@/config/rich-text-editor.config';

import RichTextEditor from './RichTextEditor';
import { RichTextEditorProps } from './RichTextEditor/RichTextEditor';

export interface TextEditorProps extends Omit<RichTextEditorProps, 'helperText'> {
  formLabel?: string | React.ReactElement;
  placeholder?: string;
  helperText?: string;
  extensions?: Extensions;
  toolbar?: ToolbarConfig;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ formLabel, helperText, extensions, toolbar, placeholder, error, ...props }, ref) => (
    <FormControl fullWidth>
      {formLabel && <FormLabel>{formLabel}</FormLabel>}
      <RichTextEditor
        {...props}
        ref={ref}
        error={error}
        helperText={helperText}
        extensions={extensions}
        toolbarConfig={toolbar}
        editorOptions={props.editorOptions}
        placeholder={placeholder}
      />
    </FormControl>
  )
);

export default TextEditor;
