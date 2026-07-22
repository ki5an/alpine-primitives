# @alpine-primitives/alert-dialog

Headless, accessible alert dialog primitive for [Alpine.js](https://alpinejs.dev).
A modal that interrupts and demands an explicit choice — `role="alertdialog"`,
not dismissed by clicking the backdrop.

## Install

```bash
npm install @alpine-primitives/alert-dialog
```

## Register

```ts
import Alpine from 'alpinejs'
import AlertDialog from '@alpine-primitives/alert-dialog'

Alpine.plugin(AlertDialog)
Alpine.start()
```

## Usage

```html
<div x-alert-dialog>
  <button x-alert-dialog-trigger>Delete</button>

  <div x-alert-dialog-overlay class="overlay"></div>

  <div x-alert-dialog-content class="panel">
    <h2 x-alert-dialog-title>Are you sure?</h2>
    <p x-alert-dialog-description>This permanently deletes the item.</p>

    <div class="actions">
      <button x-alert-dialog-cancel>Cancel</button>
      <button x-alert-dialog-action @click="destroy()">Delete</button>
    </div>
  </div>
</div>
```

```css
.panel[data-state='closed'] { display: none; }
```

## Directives

| Directive                     | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `x-alert-dialog`              | Root; owns open state.                            |
| `x-alert-dialog-trigger`      | Opens the dialog.                                 |
| `x-alert-dialog-overlay`      | Backdrop (portalled; **not** click-dismissable). |
| `x-alert-dialog-content`      | `role="alertdialog"` panel: trapped, scroll-locked. |
| `x-alert-dialog-title`        | Accessible name.                                  |
| `x-alert-dialog-description`  | Accessible description.                           |
| `x-alert-dialog-action`       | Confirms and closes. Add logic via `@click`.      |
| `x-alert-dialog-cancel`       | Dismisses; receives initial focus.                |

## Behavior

- Always modal: focus trap + scroll lock.
- **Escape** closes; **outside press does not** — the user must choose.
- Initial focus lands on the cancel action (least destructive).

## Events

`@alert-dialog:open`, `@alert-dialog:close`.

## License

MIT
