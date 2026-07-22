# @alpine-primitives/hover-card

Headless hover card primitive for [Alpine.js](https://alpinejs.dev). Reveals
rich, interactive content on hover/focus — think profile previews on a link.

## Install

```bash
npm install @alpine-primitives/hover-card
```

## Register

```ts
import Alpine from 'alpinejs'
import HoverCard from '@alpine-primitives/hover-card'

Alpine.plugin(HoverCard)
Alpine.start()
```

## Usage

```html
<span x-hover-card="{ openDelay: 500, closeDelay: 200 }">
  <a x-hover-card-trigger href="/user/adam">@adam</a>

  <div x-hover-card-content class="card">
    <div x-hover-card-arrow class="card-arrow"></div>
    <img src="/avatar.png" width="48" height="48" alt="" />
    <strong>Adam</strong>
    <a href="/user/adam/follow">Follow</a>
  </div>
</span>
```

```css
.card[data-state='closed'] { display: none; }
.card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 16px; }
```

## Directives

| Directive              | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `x-hover-card`         | Root; open/close delays and placement.             |
| `x-hover-card-trigger` | Hover/focus target.                                |
| `x-hover-card-content` | Floating, **interactive** card (portalled).        |
| `x-hover-card-arrow`   | Optional pointer, auto-positioned.                 |

## Options

```html
<span x-hover-card="{ placement: 'bottom', offset: 8, openDelay: 700, closeDelay: 300 }">
```

Unlike a tooltip, moving the pointer onto the card keeps it open, so users can
click links inside it. Closes on Escape or when both trigger and card are left.

## Events

`@hover-card:open`, `@hover-card:close`.

## License

MIT
