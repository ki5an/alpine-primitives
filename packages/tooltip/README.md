# @alpine-primitives/tooltip

Headless, accessible tooltip primitive for [Alpine.js](https://alpinejs.dev).
A `role="tooltip"` label shown on hover and keyboard focus.

## Install

```bash
npm install @alpine-primitives/tooltip
```

## Register

```ts
import Alpine from 'alpinejs'
import Tooltip from '@alpine-primitives/tooltip'

Alpine.plugin(Tooltip)
Alpine.start()
```

## Usage

```html
<span x-tooltip="{ placement: 'top', delay: 300 }">
  <button x-tooltip-trigger aria-label="Add">+</button>

  <div x-tooltip-content class="tip">
    <div x-tooltip-arrow class="tip-arrow"></div>
    Add item
  </div>
</span>
```

```css
.tip[data-state='closed'] { display: none; }
.tip { background: #111; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
```

## Directives

| Directive           | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `x-tooltip`         | Root; delays and placement via expression.           |
| `x-tooltip-trigger` | Element the tooltip describes.                        |
| `x-tooltip-content` | Floating `role="tooltip"` bubble (portalled).        |
| `x-tooltip-arrow`   | Optional pointer, auto-positioned.                   |

## Options

```html
<span x-tooltip="{ placement: 'right', offset: 6, delay: 300, closeDelay: 0 }">
```

- `delay` — ms before opening on hover (focus opens immediately). Default `300`.
- `closeDelay` — ms before closing on leave. Default `0`.
- `placement`, `offset` — as in Popover.

## Behavior

- Opens on pointer enter (after `delay`) and on focus (immediately, for keyboard).
- Closes on leave, blur, Escape, or press.
- Only one tooltip is open at a time.
- Content is non-interactive (`pointer-events: none`). For hoverable content use Hover Card.

## Accessibility

Trigger gets `aria-describedby` pointing at the content. Content is `role="tooltip"`.

## License

MIT
