import React, { useEffect } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormProps, UseFormReturn, useForm } from 'react-hook-form';

type HtmlFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export type FormSubmitHandler<T extends FieldValues> = (data: T, methods: UseFormReturn<T>) => void | Promise<void>;

export type FormProps<TValues extends FieldValues = FieldValues> = UseFormProps<TValues> &
  Omit<HtmlFormProps, 'onSubmit' | 'children'> & {
    onSubmit: FormSubmitHandler<TValues>;
    children: React.ReactNode | ((props: UseFormReturn<TValues>) => React.ReactNode);
    stopPropagation?: boolean;
    resetDefaultValues?: boolean;
  };

function Form<TValues extends FieldValues>({
  onSubmit: onSubmitProp,
  children,
  mode = 'all',
  context,
  criteriaMode,
  defaultValues,
  reValidateMode,
  resolver,
  shouldFocusError,
  shouldUnregister,
  stopPropagation = false,
  resetDefaultValues = false,
  ...props
}: FormProps<TValues>): React.ReactElement {
  const methods = useForm({
    mode,
    context,
    criteriaMode,
    defaultValues,
    reValidateMode,
    resolver,
    shouldUnregister,
    shouldFocusError,
  });

  useEffect(() => {
    if (resetDefaultValues) {
      methods.reset(defaultValues as TValues);
    }
  }, [resetDefaultValues, methods, defaultValues]);

  const onSubmit: SubmitHandler<TValues> = values => onSubmitProp(values, methods);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }

    methods.handleSubmit(onSubmit)(event);
  };

  return (
    <FormProvider {...methods}>
      <form {...props} onSubmit={handleSubmit}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}

export default Form;
