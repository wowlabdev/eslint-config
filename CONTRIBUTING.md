# Contributing

Development requires Node.js 22.13 or newer, Deno 2, pnpm, and Markupwright.

## Before you submit

```console
pnpm check
pnpm package:prepare
npm pack .package --dry-run
```

## Config changes

- Keep the base config ecosystem-neutral.
- Put each integration in its own module under `src/presets`.
- Return ordinary ESLint flat-config arrays.
- Load optional frameworks only when their preset is selected.
- Cover every public option with focused tests and README usage.
- Keep consumer `rules` and `overrides` last so projects remain in control.

Repository-specific rules belong in the consumer config.
