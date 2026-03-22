import { Controller, ControllerProps, FieldError, Validate, useFormContext } from 'react-hook-form';

import { FormControl, FormLabel, TextField, TextFieldProps } from '@mui/material';

export interface FormInputProps<T = string> extends Omit<TextFieldProps, 'name'> {
  name: ControllerProps['name'];
  formLabel?: string | React.ReactElement;
  label?: string | React.ReactElement;
  validate?: Validate<T, unknown> | Record<string, Validate<T, unknown>>;
  renderInput?: (
    field: Parameters<ControllerProps['render']>[0] & { error?: string; required?: boolean }
  ) => React.ReactElement;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedError = (name: string, errors: any): FieldError | undefined =>
  name.split(/[.[\]]+/).reduce((acc, key) => acc?.[key], errors);

function FormInput<T = string>({
  name,
  formLabel,
  label,
  validate,
  renderInput,
  helperText,
  ...props
}: FormInputProps<T>): React.ReactElement {
  const { control } = useFormContext();

  const render: ControllerProps['render'] = (p): React.ReactElement => {
    const error = getNestedError(name, p.formState.errors) as FieldError | undefined;
    const hasError = Boolean(error);

    const showAsterisk = !!validate;
    const labelWithAsterisk = label ? (
      <>
        {label}
        {showAsterisk && <span style={{ marginLeft: 2 }}>*</span>}
      </>
    ) : undefined;

    if (renderInput) {
      return renderInput({ ...p, error: error?.message, required: !!validate });
    }

    return (
      <FormControl fullWidth>
        {formLabel && <FormLabel htmlFor={name}>{formLabel}</FormLabel>}
        <TextField
          {...props}
          {...p.field}
          id={name}
          error={hasError}
          helperText={hasError ? error?.message : helperText}
          label={labelWithAsterisk}
        />
      </FormControl>
    );
  };

  return <Controller name={name} control={control} rules={{ validate }} render={render} />;
}

export default FormInput;
