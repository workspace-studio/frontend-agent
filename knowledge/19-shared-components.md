# Shared Components Library

## Overview

The `@examples/shared-components/` directory contains a library of reusable components that are shared across projects. When a component from this library is needed:

1. **Copy** the component from `@examples/shared-components/` into the project's `src/components/`
2. **Adjust SCSS style** to match the project's theme — do NOT modify functional behavior
3. **Install dependencies** if the component requires packages not yet in the project

Use the `/add-shared-components` skill to add components: `/add-shared-components Form FormInput Select`

## Available Components

### Form Components

#### Form
Wraps react-hook-form `useForm` + `FormProvider`. All FormInput components must be inside a Form.

```tsx
import Form from '@/components/Form';

<Form onSubmit={handleSubmit} defaultValues={formModels.createEntity}>
  <FormInput name="name" label={t('fields.name')} validate={FormValidator.required()} />
  <Button type="submit">{t('actions.submit')}</Button>
</Form>
```

**Props**: `onSubmit`, `defaultValues`, `children`, `mode`, `resetDefaultValues`

#### FormInput
Controller-based MUI TextField wrapper. Must be used inside a `Form`.

```tsx
<FormInput
  name="email"
  label={t('fields.email')}
  validate={FormValidator.all(FormValidator.required(), FormValidator.email())}
/>

// Custom render for non-text inputs
<FormInput
  name="status"
  label={t('fields.status')}
  renderInput={(field) => <Select {...field} options={statusOptions} />}
/>
```

**Props**: extends `TextFieldProps`, adds `name`, `formLabel`, `validate`, `renderInput`

### Selection Components

#### Select
MUI Select wrapper with MenuItem mapping.

```tsx
<Select
  value={selectedId}
  options={[{ id: '1', label: 'Option 1' }, { id: '2', label: 'Option 2' }]}
  onChange={handleChange}
  placeholder={t('select.placeholder')}
  label={t('fields.category')}
/>
```

**Props**: `value`, `options` (`{ id, label }[]`), `onChange`, `placeholder`, `label`, `error`

#### Autocomplete
MUI Autocomplete wrapper with search functionality.

```tsx
<Autocomplete
  value={selectedOption}
  options={filteredOptions}
  onChange={handleChange}
  onInputChange={handleSearch}
  label={t('fields.customer')}
/>
```

**Props**: `value`, `options`, `onChange`, `onInputChange`, `label`, `renderOption`, `filteredOptions`

#### AutocompleteMultipleChip
Multi-select Autocomplete that displays selected items as chips.

**Props**: similar to Autocomplete but with `multiple` behavior and chip rendering

#### Checkbox
MUI Checkbox wrapper with label.

#### CheckboxGroup
Group of checkboxes with label and value management.

#### RadioGroup
MUI RadioGroup wrapper with options mapping.

### Date Components

#### DatePicker
MUI DatePicker wrapped with LocalizationProvider.

```tsx
<DatePicker
  label={t('fields.startDate')}
  value={startDate}
  onChange={handleDateChange}
/>
```

**Requires**: `@mui/x-date-pickers`, `dayjs`

#### DateRangePicker
Custom date range picker with quick select filters (Today, This Week, This Month, etc.).

**Props**: `startDate`, `endDate`, `handleDateChange`, `filters`, `monthsShown`
**Requires**: `@mui/x-date-pickers`, `dayjs`

### Display Components

#### Table
MUI Table with sorting, checkbox selection, row actions, and toolbar actions.

```tsx
<Table
  columns={columns}
  rows={data}
  variant="data"
  rowActions={renderRowActions}
  toolbarActions={renderToolbarActions}
  sortBy={sortBy}
  sortDirection={sortDirection}
  onSort={handleSort}
/>
```

**Props**: `columns`, `rows`, `variant` (`'basic'` | `'data'`), `rowActions`, `toolbarActions`, `directActions`, `sortBy`, `sortDirection`, `onSort`, `onRowClick`

#### DataCard
Card view for displaying data items (alternative to table view).

#### DataDisplay
Unified Table/Card view switcher. Renders either Table or DataCard based on `viewType`.

**Props**: extends TableProps, adds `cardData`, `onCardClick`, `viewType`, `twoColumnLayout`

#### MeatballsMenu
Vertical dots (3-dots) menu for row actions.

```tsx
<MeatballsMenu>
  <MenuItem onClick={handleEdit}>{t('actions.edit')}</MenuItem>
  <MenuItem onClick={handleDelete}>{t('actions.delete')}</MenuItem>
</MeatballsMenu>
```

**Props**: `children`, `anchorOriginVertical`, `transformOriginVertical`, `sx`, `size`

### Layout Components

#### ModalRoot
Responsive MUI Dialog — shows as Dialog on desktop, SwipeableDrawer on mobile.

```tsx
<ModalRoot
  open={createModalOpen}
  title={t('modals.create.title')}
  onClose={() => toggleCreateModal(false)}
  onConfirm={handleSubmit}
  confirmBtnText={t('actions.create')}
  cancelBtnText={t('actions.cancel')}
>
  {/* form content */}
</ModalRoot>
```

**Props**: extends `DialogProps`, adds `open`, `title`, `onClose`, `onConfirm`, `confirmBtnText`, `cancelBtnText`, `arrowBack`, `onBack`

#### Accordion
MUI Accordion wrapper with consistent styling.

#### Loader
MUI CircularProgress centered in a full-height container.

```tsx
<Loader />           // Full viewport height
<Loader height={400} /> // Custom height
```

**Props**: `height` (default: `'100vh'`)

### Input Components

#### Search
Search input with icon and clear button.

#### TextEditor
Tiptap-based rich text editor with toolbar.

**Requires**: `@tiptap/react`, `@tiptap/starter-kit`, and extensions

### Feedback Components

#### Toast
MUI Snackbar + Alert wrapper for notifications.

#### Tooltip
MUI Tooltip wrapper with consistent styling.

### Pagination

#### Pagination
MUI Pagination with custom arrow icons.

```tsx
<Pagination page={currentPage} onChange={handlePageChange} count={totalPages} />
```

**Props**: `page`, `onChange`, `count`

### SVG Icons

Shared SVG icon components in `@examples/shared-components/SvgIcons/`. Copy needed icons when adding components that reference them.

| Icon | Used By |
|------|---------|
| CheckboxChecked, CheckboxUnchecked, CheckboxIndeterminate | Checkbox |
| RadioChecked, RadioUnchecked | RadioGroup |
| Calendar | DatePicker, DateRangePicker |
| Close | ModalRoot, AutocompleteMultipleChip |
| Search | Search |
| VerticalDots | MeatballsMenu |
| Check | AutocompleteMultipleChip (SearchOptionItem) |
| Error, Info, Success, Warning | Toast |

All icons share a common props pattern: `size`, `fill`, `width`, `height`.

## Semantic Color Variables

Components use **semantic color variable names** — not project-specific color names. Projects must define these variables in their styles:

**SCSS** (`@/styles/settings/variables`):

| Variable | Purpose |
|----------|---------|
| `$white`, `$black` | Universal base colors |
| `$bg-hover` | Hover backgrounds |
| `$bg-subtle` | Light backgrounds, subtle borders |
| `$bg-active` | Active row/item backgrounds |
| `$border-color` | Default borders, dividers, scrollbars |
| `$text-primary` | Primary text |
| `$text-secondary` | Secondary text, focus borders |
| `$text-tertiary` | Description text |
| `$text-placeholder` | Placeholder text, default icons |
| `$text-disabled` | Disabled text, handles |
| `$text-label` | Labels (weekdays, etc.) |
| `$text-muted` | Muted text |
| `$accent-color` | Primary accent (selected, links) |
| `$accent-lightest` | Very light accent backgrounds |
| `$accent-light` | Range/selection backgrounds |
| `$accent-hover` | Accent hover |
| `$accent-active` | Accent pressed |
| `$accent-dark` | Dark accent (link hover) |
| `$error-color` | Error states |

**TSX** (`@/styles/themes/colors`): same names in camelCase (`colors.borderColor`, `colors.textSecondary`, etc.)

## Rules

- **ALWAYS check** if a shared component exists before creating a new one
- **COPY source code** exactly — do not modify functional behavior
- **ONLY adjust SCSS** styles to match the project's theme
- Maintain the `index.ts` barrel pattern: `import X from './X'; export default X;`
- Check for missing dependencies and install them
