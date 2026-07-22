import Alpine from 'alpinejs'
import Dialog from '@alpine-primitives/dialog'

Alpine.plugin(Dialog)

// Handy for poking at state from the devtools console.
;(window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine

Alpine.start()
