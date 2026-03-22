/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonBase, Menu, SvgIcon, Typography } from '@mui/material';
import { buttonBaseClasses } from '@mui/material/ButtonBase';
import { listClasses } from '@mui/material/List';
import { Editor } from '@tiptap/react';

import ToolbarItem from '@/components/TextEditor/components/ToolbarItem';
import { HeadingLevel } from '@/config/rich-text-editor.config';
import colors from '@/styles/themes/colors';

import styles from './HeadingBlock.module.scss';

interface HeadingBlockProps {
  editor: Editor | null;
  levels?: HeadingLevel[];
}

type RichTextEditorKey =
  | 'paragraph'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6';

const HEADING_STYLES: Record<HeadingLevel, { fontSize: number; fontWeight: number }> = {
  1: { fontSize: 32, fontWeight: 700 },
  2: { fontSize: 24, fontWeight: 700 },
  3: { fontSize: 18, fontWeight: 600 },
  4: { fontSize: 16, fontWeight: 600 },
  5: { fontSize: 14, fontWeight: 600 },
  6: { fontSize: 12, fontWeight: 600 },
};

const HeadingBlock = ({ editor, levels = [1, 2, 3, 4, 5, 6] }: HeadingBlockProps) => {
  const { t } = useTranslation('rich-text-editor');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetParagraph = () => {
    handleClose();
    editor?.chain().focus().setParagraph().run();
  };

  const handleSetHeading = (level: HeadingLevel) => {
    handleClose();
    editor?.chain().focus().setHeading({ level }).run();
  };

  if (!editor) {
    return null;
  }

  const headingOptions = levels.map(level => `heading-${level}` as const);

  const currentHeading = levels.find(level => editor.isActive('heading', { level }))
    ? `heading-${levels.find(level => editor.isActive('heading', { level }))}`
    : editor.isActive('paragraph')
      ? 'paragraph'
      : 'paragraph';

  const isOpen = Boolean(anchorEl);

  return (
    <>
      <ButtonBase
        id="heading-menu-button"
        aria-label="Heading menu button"
        aria-controls={anchorEl ? 'heading-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClick}
        className={styles.headingButton}
        sx={{
          padding: '16px 12px',
          color: isOpen ? colors.grayBlue600 : colors.grayBlue400,
          border: `1px solid ${isOpen ? colors.grayBlue600 : colors.grayBlue200}`,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: '140px',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: colors.grayBlue400,
            color: colors.grayBlue600,
          },
        }}
      >
        <Typography variant="body2" component="span">
          {t(currentHeading as RichTextEditorKey)}
        </Typography>
        <SvgIcon sx={{ fontSize: 20, transition: 'transform 0.2s' }}>
          {isOpen ? (
            <path d="M12 8L6 14L7.41 15.41L12 10.83L16.59 15.41L18 14L12 8Z" />
          ) : (
            <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" />
          )}
        </SvgIcon>
      </ButtonBase>
      <Menu
        id="heading-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          list: { 'aria-labelledby': 'heading-button' },
          paper: {
            sx: {
              mt: 0.5,
              minWidth: anchorEl?.offsetWidth || 140,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              [`& .${listClasses.root}`]: {
                py: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              },
              [`& .${buttonBaseClasses.root}`]: {
                py: 1.5,
                px: 2,
                justifyContent: 'flex-start',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: colors.grayBlue50,
                },
                '&.Mui-selected': {
                  backgroundColor: colors.grayBlue100,
                  '&:hover': {
                    backgroundColor: colors.grayBlue100,
                  },
                },
              },
            },
          },
        }}
      >
        <ToolbarItem
          component="li"
          label={t('paragraph')}
          active={editor.isActive('paragraph')}
          onClick={handleSetParagraph}
          onMouseDown={e => e.preventDefault()}
          variant="menu"
          sx={{
            fontSize: 16,
          }}
        />
        {headingOptions.map((heading, index) => {
          const level = levels[index];
          const headerStyles = HEADING_STYLES[level];

          return (
            <ToolbarItem
              aria-label={heading}
              component="li"
              key={heading}
              label={t(heading as RichTextEditorKey)}
              active={editor.isActive('heading', { level })}
              onClick={() => handleSetHeading(level)}
              onMouseDown={e => e.preventDefault()}
              variant="menu"
              sx={{
                fontSize: headerStyles.fontSize,
                fontWeight: headerStyles.fontWeight,
              }}
            />
          );
        })}
      </Menu>
    </>
  );
};

export default HeadingBlock;
