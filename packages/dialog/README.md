# @alpine-primitives/dialog

Headless, accessible dialog (modal) primitive for [Alpine.js](https://alpinejs.dev).
Unstyled — you own the markup and CSS; the primitive owns state, focus, portalling,
scroll-lock, and ARIA.

## Install

```bash
npm install @alpine-primitives/dialog
```

`@alpine-primitives/core` is installed automatically. Alpine is a peer dependency.

## Register

```ts
import Alpine from 'alpinejs'
import Dialog from '@alpine-primitives/dialog'

Alpine.plugin(Dialog)
Alpine.start()
```

## Usage

```html
<div x-dialog>
  <button x-dialog-trigger>Open</button>

  <template x-teleport="body"><!-- optional; the primitive already portals --></template>

  <div x-dialog-overlay class="overlay"></div>

  <div x-dialog-content class="panel">
    <h2 x-dialog-title>Payment</h2>
    <p x-dialog-description>Confirm your purchase.</p>

    <button x-dialog-close>Cancel</button>
  </div>
</div>
```

Nothing is visible until you add CSS. Target state with the `data-state` attribute:

```css
.panel { display: none; }
.panel[data-state='open'] { display: block; }

.overlay { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); }
```

## Directives

| Directive               | Element            | Purpose                                            |
| ----------------------- | ------------------ | -------------------------------------------------- |
| `x-dialog`              | root wrapper       | Owns open state; provides context to descendants.  |
| `x-dialog-trigger`      | `<button>`         | Toggles the dialog. Wires `aria-expanded`.         |
| `x-dialog-content`      | panel              | `role="dialog"`, focus trap, portal, Escape close. |
| `x-dialog-overlay`      | backdrop           | Click-to-dismiss (modal only). Portalled.          |
| `x-dialog-close`        | any clickable      | Closes the dialog.                                 |
| `x-dialog-title`        | heading            | Accessible name (`aria-labelledby`).               |
| `x-dialog-description`  | text               | Accessible description (`aria-describedby`).        |

## Options

```html
<!-- Initially open -->
<div x-dialog="true"> ... </div>

<!-- Non-modal: no scroll-lock, overlay click does not dismiss -->
<div x-dialog.non-modal> ... </div>
<div x-dialog="{ open: false, modal: false }"> ... </div>
```

## Events

Dispatched on the root element, bubbling:

```html
<div x-dialog @dialog:open="console.log('opened')" @dialog:close="console.log('closed')">
```

## Magic

```html
<span x-text="$dialog.open ? 'Open' : 'Closed'"></span>
<button @click="$dialog.setOpen(false)">Close from anywhere inside</button>
```

## Accessibility

- `role="dialog"` + `aria-modal` on the panel.
- Focus moves into the panel on open and returns to the trigger on close.
- Tab / Shift+Tab are trapped within the panel.
- Escape closes the dialog.
- Title/description wired via `aria-labelledby` / `aria-describedby`.

## License

MIT
