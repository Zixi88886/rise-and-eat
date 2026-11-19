// Day or night: which look the page has. The student chooses Day, Night, or Automatic.
// Automatic is night when the phone is set to dark, or when the clock says it is dark (evening to morning).
// This file holds only the rules (no screen, no saving), so they can be checked with pretend clocks.
// The same rule is written in a tiny script at the top of index.html, so the page is dark from its first
// moment and never flashes bright at night; a check keeps the two the same.

export const THEMES = ['day', 'night', 'auto'];
export const DEFAULT_THEME = 'day'; // the page looked like this before there was a night look

// Night is from 7 pm until 6 am by the clock. (The real sunset would need the student's place, which the app never asks for.)
export const NIGHT_STARTS_HOUR = 19;
export const NIGHT_ENDS_HOUR = 6;

// Is the clock's hour (0 to 23) in the dark hours?
export function isDarkHour(hour) {
  return hour >= NIGHT_STARTS_HOUR || hour < NIGHT_ENDS_HOUR;
}

// Should the page look like night now? `phoneIsDark` is what the phone says (prefers-color-scheme: dark).
export function isNight(theme, hour, phoneIsDark) {
  if (theme === 'night') return true;
  if (theme === 'auto') return Boolean(phoneIsDark) || isDarkHour(hour);
  return false;
}

// A saved choice, or the default if it is not one of the three.
export function cleanTheme(value) {
  return THEMES.includes(value) ? value : DEFAULT_THEME;
}
