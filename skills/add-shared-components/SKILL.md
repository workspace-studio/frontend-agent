---
name: add-shared-components
description: Copy shared components from the component library into the current project
---

# Add Shared Components

Copy shared components into the project. Usage: `/add-shared-components Form FormInput Select DatePicker`

## Pre-Work

1. READ @knowledge/19-shared-components.md for available components
2. READ @examples/shared-components/ to see what's available
3. CHECK if the requested components already exist in the project's `src/components/`

## Available Components

| Component | Description |
|-----------|-------------|
| Form | react-hook-form useForm + FormProvider wrapper |
| FormInput | Controller + MUI TextField wrapper |
| Select | MUI Select + MenuItem wrapper |
| Autocomplete | MUI Autocomplete wrapper |
| AutocompleteMultipleChip | Multi-select Autocomplete with chips |
| DatePicker | MUI DatePicker + LocalizationProvider |
| DateRangePicker | Custom date range with Menu |
| Table | MUI Table with sorting, selection, row actions |
| ModalRoot | Responsive MUI Dialog (desktop/mobile) |
| Pagination | MUI Pagination with custom icons |
| Loader | MUI CircularProgress centered |
| Accordion | MUI Accordion wrapper |
| Checkbox | MUI Checkbox wrapper |
| CheckboxGroup | Grouped checkboxes |
| DataCard | Card view for data items |
| DataDisplay | Table/Card view switcher |
| RadioGroup | MUI RadioGroup wrapper |
| Search | Search input component |
| TextEditor | Tiptap rich text editor |
| Toast | MUI Snackbar/Alert wrapper |
| Tooltip | MUI Tooltip wrapper |
| MeatballsMenu | Vertical dots (3-dots) menu |
| SvgIcons | Shared SVG icon components |

## Steps

### Step 1: Check Existing Components

```bash
ls src/components/
```

Skip any component that already exists in the project.

### Step 2: Copy Components

For each requested component:

1. Read the source from `@examples/shared-components/{ComponentName}/`
2. Copy ALL files (.tsx, .module.scss if exists, index.ts) to `src/components/{ComponentName}/`
3. Copy required SvgIcons from `@examples/shared-components/SvgIcons/` to `src/components/SvgIcons/`
4. Update import paths if project uses different aliases

### Step 3: Install Dependencies (if needed)

Some components require additional packages:
- **DatePicker/DateRangePicker**: `@mui/x-date-pickers`, `dayjs`
- **TextEditor**: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-*`
- **AutocompleteMultipleChip**: No extra deps (uses MUI Autocomplete)

### Step 4: Verify

```bash
yarn build
yarn lint
```

## Rules

- Copy source code exactly — do NOT modify functional behavior
- User will adjust SCSS styles per project
- Maintain the index.ts barrel export pattern: `import X from './X'; export default X;`
- Check for missing dependencies and install them
- NEVER overwrite existing components — skip if they already exist
