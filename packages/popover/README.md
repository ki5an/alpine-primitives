# @alpine-primitives/popover

Headless, accessible popover primitive for [Alpine.js](https://alpinejs.dev). A
non-modal floating panel anchored to its trigger — positioning, dismissal, focus
and ARIA handled; markup and styling are yours.

## Install

```bash
npm install @alpine-primitives/popover
```

## Register

```ts
import Alpine from 'alpinejs'
import Popover from '@alpine-primitives/popover'

Alpine.plugin(Popover)
Alpine.start()
```

## Usage

```html
<div x-popover="{ placement: 'bottom-start' }">
  <button x-popover-trigger>Options</button>

  <div x-popover-content class="popover">
    <div x-popover-arrow class="arrow"></div>
    <p>Panel content</p>
    <button x-popover-close>Close</button>
  </div>
</div>
```

```css
.popover[data-state='closed'] { display: none; }
.popover { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
.arrow { width: 10px; height: 10px; background: #fff; rotate: 45deg; }
```

## Directives

| Directive            | Purpose                                                        |
| -------------------- | ------------------------------------------------------------- |
| `x-popover`          | Root; owns open state. Options via expression.                |
| `x-popover-trigger`  | Toggles the popover; default positioning anchor.              |
| `x-popover-anchor`   | Optional alternate anchor element.                            |
| `x-popover-content`  | Floating panel: portalled, positioned, dismissable.           |
| `x-popover-arrow`    | Optional pointer, auto-positioned to the anchor.              |
| `x-popover-close`    | Closes the popover.                                           |

## Options

```html
<div x-popover="{ placement: 'top-end', offset: 12, modal: false }">
```

- `placement` — `top`/`right`/`bottom`/`left` optionally suffixed `-start`/`-end`. Default `bottom`.
- `offset` — gap in px. Default `8`.
- `modal` — `true` traps focus + locks scroll. Default `false`. (`.modal` modifier also works.)

Position reacts to scroll/resize and flips/shifts to stay in view. `data-side`
and `data-align` are set on the content for styling.

## Events

`@popover:open`, `@popover:close` (dispatched on the root, bubbling).

## Accessibility

- Trigger: `aria-haspopup="dialog"`, `aria-controls`, live `aria-expanded`.
- Content: `role="dialog"`, `aria-modal` when modal.
- Escape and outside press dismiss; focus returns to the trigger.

## License

MIT
