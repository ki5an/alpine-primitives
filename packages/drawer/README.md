# @alpine-primitives/drawer

Headless, accessible drawer primitive for [Alpine.js](https://alpinejs.dev). An
edge panel (default bottom) that can be **dragged to dismiss**.

## Install

```bash
npm install @alpine-primitives/drawer
```

## Register

```ts
import Alpine from 'alpinejs'
import Drawer from '@alpine-primitives/drawer'

Alpine.plugin(Drawer)
Alpine.start()
```

## Usage

```html
<div x-drawer.bottom>
  <button x-drawer-trigger>Open</button>

  <div x-drawer-overlay class="overlay"></div>

  <div x-drawer-content class="drawer">
    <div x-drawer-handle class="grabber"></div>
    <h2 x-drawer-title>Filters</h2>
    <p x-drawer-description>Refine the results.</p>
    <button x-drawer-close>Done</button>
  </div>
</div>
```

```css
.drawer { position: fixed; left: 0; right: 0; bottom: 0; transition: translate 0.25s ease; }
.drawer[data-side='bottom'][data-state='closed'] { translate: 0 100%; }
.grabber { width: 40px; height: 4px; border-radius: 2px; background: #ccc; margin: 8px auto; }
```

## Directives

| Directive            | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `x-drawer`           | Root; `side`, `modal`, `dismissThreshold` options.   |
| `x-drawer-trigger`   | Toggles the drawer.                                  |
| `x-drawer-overlay`   | Backdrop; click-to-dismiss when modal.               |
| `x-drawer-content`   | Edge panel: portalled, trapped, scroll-locked.       |
| `x-drawer-handle`    | Grab affordance; drag it to dismiss.                 |
| `x-drawer-close`     | Closes the drawer.                                   |
| `x-drawer-title` / `x-drawer-description` | Accessible name / description.  |

## Options

```html
<div x-drawer="{ side: 'bottom', dismissThreshold: 120 }"></div>
```

- `side` — edge to anchor. Default `bottom`. (Modifier form: `.bottom` etc.)
- `dismissThreshold` — drag distance in px past which release closes. Default `100`.
- `modal` — focus trap + scroll lock. Default `true`.

Dragging the handle away from the edge translates the panel live; releasing past
the threshold closes it, otherwise it snaps back.

## Events

`@drawer:open`, `@drawer:close`.

## License

MIT
