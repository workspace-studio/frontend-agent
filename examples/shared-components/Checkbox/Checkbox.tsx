import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from '@mui/material';

import CheckboxChecked from '@/components/SvgIcons/Checkbox/CheckboxChecked';
import CheckboxIndeterminate from '@/components/SvgIcons/Checkbox/CheckboxIndeterminate';
import CheckboxUnchecked from '@/components/SvgIcons/Checkbox/CheckboxUnchecked';

const Checkbox = ({ value, checked, onChange, ...props }: MuiCheckboxProps) => (
  <MuiCheckbox
    value={value}
    checked={checked}
    onChange={onChange}
    indeterminateIcon={<CheckboxIndeterminate />}
    icon={<CheckboxUnchecked />}
    checkedIcon={<CheckboxChecked />}
    {...props}
  />
);

export default Checkbox;
