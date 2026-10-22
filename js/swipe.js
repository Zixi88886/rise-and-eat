// Rules for swiping the floating message away, kept apart from the screen so they are easy to test.

// How far up (in pixels) the message must be dragged to count as swiped away.
export const SWIPE_DISMISS_DISTANCE = 40;

// How far (in pixels) a touch can move and still count as a tap.
export const TAP_DISTANCE = 6;

// The message follows the finger upward only; dragging down does not move it.
export function dragOffset(startY, currentY) {
  return Math.min(0, currentY - startY);
}

// True when the finger has been dragged far enough up.
export function isSwipeUp(startY, endY) {
  return startY - endY >= SWIPE_DISMISS_DISTANCE;
}

// True when the touch barely moved, so it was a tap.
export function isTap(startY, endY) {
  return Math.abs(endY - startY) <= TAP_DISTANCE;
}
