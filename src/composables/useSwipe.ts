import { onUnmounted, ref } from 'vue'

type Direction = 'next' | 'previous'
type Position = { x: number; y: number }

// Share gesture thresholds and click suppression between galleries and cards.
export const useSwipe = (
  move: (direction: Direction) => void,
  canStart: (event: TouchEvent | MouseEvent) => boolean = () => true,
  onMouseDragChange: (active: boolean) => void = () => {},
) => {
  const dragging = ref(false)
  const dragOffset = ref(0)
  let touchStart: Position | null = null
  let mouseStart: Position | null = null
  let suppressClickUntil = 0

  const finishSwipe = (origin: Position, x: number, y: number) => {
    const dx = x - origin.x
    const dy = y - origin.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 36) return
    suppressClickUntil = performance.now() + 600
    if (Math.abs(dx) > Math.abs(dy) * 1.25) move(dx < 0 ? 'next' : 'previous')
  }
  const startSwipe = (event: TouchEvent) => {
    const touch = event.touches[0]
    touchStart =
      event.touches.length === 1 && touch && canStart(event)
        ? { x: touch.clientX, y: touch.clientY }
        : null
  }
  const cancelSwipe = () => {
    touchStart = null
  }
  const endSwipe = (event: TouchEvent) => {
    const origin = touchStart
    touchStart = null
    const touch = event.changedTouches[0]
    if (origin && touch && !event.touches.length) finishSwipe(origin, touch.clientX, touch.clientY)
  }
  const cancelMouseDrag = () => {
    mouseStart = null
    dragOffset.value = 0
    window.removeEventListener('mousemove', updateMouseDrag)
    window.removeEventListener('mouseup', endMouseDrag)
    window.removeEventListener('blur', cancelMouseDrag)
    if (dragging.value) {
      dragging.value = false
      onMouseDragChange(false)
    }
  }
  const updateMouseDrag = (event: MouseEvent) => {
    if (!mouseStart) return
    if (!(event.buttons & 1)) {
      cancelMouseDrag()
      return
    }
    const dx = event.clientX - mouseStart.x
    const dy = event.clientY - mouseStart.y
    dragOffset.value = Math.abs(dx) > Math.abs(dy) * 1.25 ? Math.max(-100, Math.min(100, dx)) : 0
    if (Math.abs(dragOffset.value) > 8) event.preventDefault()
  }
  const endMouseDrag = (event: MouseEvent) => {
    const origin = mouseStart
    if (origin && event.button === 0) finishSwipe(origin, event.clientX, event.clientY)
    cancelMouseDrag()
  }
  const startMouseDrag = (event: MouseEvent) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      !(event.target instanceof Element) ||
      event.target.closest('button, input, select, textarea') ||
      !canStart(event)
    )
      return
    cancelMouseDrag()
    mouseStart = { x: event.clientX, y: event.clientY }
    dragging.value = true
    onMouseDragChange(true)
    window.addEventListener('mousemove', updateMouseDrag)
    window.addEventListener('mouseup', endMouseDrag)
    window.addEventListener('blur', cancelMouseDrag)
  }
  const handleNativeDrag = (event: DragEvent) => {
    if (dragging.value) event.preventDefault()
  }
  const handleSwipeClick = (event: MouseEvent) => {
    if (event.detail === 0 || performance.now() >= suppressClickUntil) return
    suppressClickUntil = 0
    event.preventDefault()
    event.stopPropagation()
  }
  onUnmounted(() => {
    cancelSwipe()
    cancelMouseDrag()
  })
  return {
    startSwipe,
    endSwipe,
    cancelSwipe,
    handleSwipeClick,
    dragging,
    dragOffset,
    mouseEvents: { mousedown: startMouseDrag, dragstart: handleNativeDrag },
  }
}
