import React, { ReactNode } from 'react';

import { ExpandMoreOutlined } from '@mui/icons-material';
import { AccordionDetails, AccordionSummary, Accordion as MuiAccordion, Typography } from '@mui/material';

import colors from '@/styles/themes/colors';
import { ACCORDION_ICON_MAP, AccordionIconKey } from '@/types/accordion.type';

import styles from './Accordion.module.scss';

interface AccordionProps {
  title: string;
  children: ReactNode;
  mt?: boolean;
  icon?: AccordionIconKey;
}

const Accordion = ({ title, children, mt, icon }: AccordionProps) => {
  const IconComponent = icon ? ACCORDION_ICON_MAP[icon] : null;

  return (
    <MuiAccordion
      classes={{ root: styles.root }}
      sx={{ marginTop: mt ? 2 : 0 }}
      className={styles.container}
      defaultExpanded
    >
      <AccordionSummary
        classes={{ content: styles.summary }}
        expandIcon={<ExpandMoreOutlined sx={{ color: colors.textSecondary }} />}
      >
        {IconComponent &&
          React.createElement(IconComponent, {
            fill: colors.textSecondary,
            size: 20,
          })}
        <Typography variant="h3" fontWeight={600}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion;
