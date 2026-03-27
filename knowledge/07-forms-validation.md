# Forms & Validation

## react-hook-form

All forms use react-hook-form. The pattern differs between React and Next.js.

## React Pattern — Form + FormInput

React projects use custom `Form` and `FormInput` wrapper components:

```tsx
import { Form, FormInput } from '@/components/Form';
import { FormValidator } from '@/utils/validation';
import { formModels } from '@/config/forms/form-models.config';

const CreateBookingForm = () => {
  const { t } = useTranslation('bookings');

  const handleSubmit = async (values: CreateBookingFormValues) => {
    const response = await createBooking(values);
    if (response.payload) {
      toggleCreateModal(false);
      getBookings(currentParams);
    }
  };

  return (
    <Form onSubmit={handleSubmit} defaultValues={formModels.createBooking}>
      <FormInput
        name="name"
        label={t('fields.name')}
        validate={FormValidator.required()}
      />
      <FormInput
        name="email"
        label={t('fields.email')}
        validate={FormValidator.all(
          FormValidator.required(),
          FormValidator.email()
        )}
      />
      <FormInput
        name="phone"
        label={t('fields.phone')}
      />
      <Button type="submit">{t('actions.create')}</Button>
    </Form>
  );
};
```

### FormValidator Utilities

```typescript
FormValidator.required()           // Field is required
FormValidator.email()              // Valid email format
FormValidator.minLength(n)         // Minimum length
FormValidator.maxLength(n)         // Maximum length
FormValidator.all(...validators)   // Combine multiple validators
```

### Custom renderInput

For non-text inputs (Select, Autocomplete, DatePicker):

```tsx
<FormInput
  name="status"
  label={t('fields.status')}
  renderInput={(field) => (
    <Select {...field} options={statusOptions} />
  )}
/>
```

## Next.js Pattern — Controller

Next.js projects use react-hook-form's `Controller` directly:

```tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const t = useTranslations('contact');
  const { control, handleSubmit, formState: { errors } } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: t('validation.required') }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={t('fields.name')}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit">{t('actions.submit')}</Button>
    </form>
  );
};
```

## Form Config Files

### form-models.config.ts — Default values + types

```typescript
// src/config/forms/form-models.config.ts
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface CreateBookingFormValues {
  name: string;
  email: string;
  phone: string;
  startDate: null;
  endDate: null;
}

export const formModels = {
  login: {
    email: '',
    password: '',
  },
  createBooking: {
    name: '',
    email: '',
    phone: '',
    startDate: null,
    endDate: null,
  },
};
```

### form-names.config.ts — Form ID constants

```typescript
// src/config/forms/form-names.config.ts
export const FORM_NAMES = {
  LOGIN: 'login-form',
  REGISTER: 'register-form',
  CREATE_BOOKING: 'create-booking-form',
} as const;
```

### Form usage rules

- `<Form>` — NO generic types (`<Form>` not `<Form<LoginFormValues>>`), always pass `id={FORM_NAMES.LOGIN}` and `mode="onBlur"`
- `<FormInput>` — use `label` prop (filled variant), NOT `placeholder`
- Form value interfaces live in `form-models.config.ts` — never define locally in the view
- Use `useToggleState` hook for password visibility — never manual `useState`
- NEVER `console.log` form data — security risk with passwords

## Multi-Step Wizard

```tsx
const [activeStep, setActiveStep] = useState(0);
const isLastStep = activeStep === steps.length - 1;

<Stepper activeStep={activeStep}>
  {steps.map((step) => <Step key={step}><StepLabel>{step}</StepLabel></Step>)}
</Stepper>

{activeStep === 0 && <StepOne />}
{activeStep === 1 && <StepTwo />}

<Button onClick={() => isLastStep ? handleSubmit() : setActiveStep(prev => prev + 1)}>
  {isLastStep ? t('submit') : t('next')}
</Button>
```
