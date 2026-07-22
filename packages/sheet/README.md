# @alpine-primitives/sheet

Headless, accessible sheet primitive for [Alpine.js](https://alpinejs.dev). A
modal panel anchored to a viewport edge (a.k.a. side panel / off-canvas).

## Install

```bash
npm install @alpine-primitives/sheet
```

## Register

```ts
import Alpine from 'alpinejs'
import Sheet from '@alpine-primitives/sheet'

Alpine.plugin(Sheet)
Alpine.start()
```

## Usage

```html
<div x-sheet.right>
  <button x-sheet-trigger>Open</button>

  <div x-sheet-overlay class="overlay"></div>

  <div x-sheet-content class="sheet">
    <h2 x-sheet-title>Settings</h2>
    <p x-sheet-description>Manage your preferences.</p>
    <button x-sheet-close>Close</button>
  </div>
</div>
```

`data-side` is set on the root and content — drive the slide-in from CSS:

```css
.sheet { position: fixed; top: 0; bottom: 0; right: 0; width: 20rem; transition: translate 0.2s ease; }
.sheet[data-side='right'][data-state='closed'] { translate: 100% 0; }
.sheet[data-side='left']  { right: auto; left: 0; }
.sheet[data-side='left'][data-state='closed'] { translate: -100% 0; }
```

## Directives

| Directive           | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `x-sheet`           | Root; `side` + `modal` options.                  |
| `x-sheet-trigger`   | Toggles the sheet.                               |
| `x-sheet-overlay`   | Backdrop; click-to-dismiss when modal.           |
| `x-sheet-content`   | Edge panel: portalled, trapped, scroll-locked.   |
| `x-sheet-close`     | Closes the sheet.                                |
| `x-sheet-title`     | Accessible name.                                 |
| `x-sheet-description` | Accessible description.                        |

## Options

```html
<div x-sheet.left></div>
<div x-sheet="{ side: 'bottom', modal: true }"></div>
```

- `side` — `top`/`right`/`bottom`/`left`. Default `right`. (Modifier form: `.left` etc.)
- `modal` — focus trap + scroll lock. Default `true`. `.non-modal` disables.

## Events

`@sheet:open`, `@sheet:close`.

## License

MIT
