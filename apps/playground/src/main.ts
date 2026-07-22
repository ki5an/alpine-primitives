import Alpine from 'alpinejs'
import Dialog from '@alpine-primitives/dialog'
import AlertDialog from '@alpine-primitives/alert-dialog'
import Popover from '@alpine-primitives/popover'
import Tooltip from '@alpine-primitives/tooltip'
import HoverCard from '@alpine-primitives/hover-card'
import Sheet from '@alpine-primitives/sheet'
import Drawer from '@alpine-primitives/drawer'

Alpine.plugin(Dialog)
Alpine.plugin(AlertDialog)
Alpine.plugin(Popover)
Alpine.plugin(Tooltip)
Alpine.plugin(HoverCard)
Alpine.plugin(Sheet)
Alpine.plugin(Drawer)

// Handy for poking at state from the devtools console.
;(window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine

Alpine.start()
