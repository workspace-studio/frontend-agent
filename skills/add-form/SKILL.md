---
name: add-form
description: Add a react-hook-form form with validation and translations
---

# Add Form

Add a form with validation. Usage: `/add-form FormName — field1(type, validation), field2(type)`

## Pre-Work

1. READ @knowledge/07-forms-validation.md
2. READ existing forms in the project for patterns
3. Detect stack (Next.js uses Controller directly, React uses Form+FormInput wrapper)

## Steps

### Step 1: Create Form Component

**React (Form + FormInput pattern):**
```tsx
<Form onSubmit={handleSubmit} defaultValues={formModels.createEntity}>
  <FormInput name="name" label={t('fields.name')} validate={FormValidator.required()} />
  <FormInput name="email" label={t('fields.email')} validate={FormValidator.all(FormValidator.required(), FormValidator.email())} />
  <Button type="submit">{t('actions.submit')}</Button>
</Form>
```

**Next.js (Controller pattern):**
```tsx
const { control, handleSubmit } = useForm<FormValues>();

<Controller name="name" control={control} rules={{ required: true }}
  render={({ field, fieldState }) => (
    <TextField {...field} error={!!fieldState.error} label={t('fields.name')} />
  )}
/>
```

### Step 2: Define Form Model

Add default values to `config/forms/form-models.config.ts` (React) or inline (Next.js).

### Step 3: Wire Submit Handler

- React: call store action → close modal → refresh list
- Next.js: call server action → revalidate → redirect

### Step 4: Add Translations

Add field labels and validation messages to ALL locales.

### Step 5: Validate

```bash
yarn build && yarn lint
```
