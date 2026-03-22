import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Popover, Stack, TextField, Typography } from '@mui/material';
import { Editor } from '@tiptap/react';

import ToolbarItem from '@/components/TextEditor/components/ToolbarItem';

import styles from './ImageBlock.module.scss';

interface ImageBlockProps {
  editor: Editor | null;
}

const ImageBlock = ({ editor }: ImageBlockProps) => {
  const { t } = useTranslation('rich-text-editor');
  const [url, setUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setUrl('');
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleUpdateUrl = () => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }

    handleClosePopover();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleUpdateUrl();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <ToolbarItem
        title={t('toolbar.image')}
        aria-label="Image"
        onClick={handleOpenPopover}
        icon={
          <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
        }
      />
      <Popover
        id={anchorEl ? 'image-popover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { className: styles.popover } }}
      >
        <Typography variant="body2" className={styles.title}>
          {t('image-label')}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            placeholder={t('image-placeholder')}
            value={url}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUrl(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoFocus
            sx={{
              '& .MuiInputBase-root': {
                height: '100%',
              },
            }}
          />
          <Button size="large" variant="contained" onClick={handleUpdateUrl}>
            {t('apply')}
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default ImageBlock;
