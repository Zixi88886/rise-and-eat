// A photo and a video link the student can add to a breakfast step. Kept apart from the step
// pictures and highlights because photos are much bigger to store.

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIDEO_FILE = /\.(?:mp4|webm|ogg|mov|m4v)$/i;

// What a pasted video link is: { kind, src, link } or null if it is not a link we can play.
// Only secure (https) links are used. YouTube and Vimeo play in their own small player; a link
// straight to a video file plays in the browser's own player.
export function parseVideoLink(text) {
  const link = String(text || '').trim();
  let url;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.replace(/^(?:www\.|m\.)/, '');

  let youtubeId = null;
  if (host === 'youtu.be') youtubeId = url.pathname.slice(1);
  else if (host === 'youtube.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (url.pathname === '/watch') youtubeId = url.searchParams.get('v');
    else if (['shorts', 'embed'].includes(parts[0])) youtubeId = parts[1];
  }
  if (youtubeId && YOUTUBE_ID.test(youtubeId)) {
    return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`, link };
  }

  const vimeoId = host === 'vimeo.com' ? url.pathname.slice(1) : null;
  if (vimeoId && /^\d+$/.test(vimeoId)) {
    return { kind: 'vimeo', src: `https://player.vimeo.com/video/${vimeoId}`, link };
  }

  if (VIDEO_FILE.test(url.pathname)) return { kind: 'file', src: link, link };
  return null;
}

// The size a photo is shrunk to so that its longest side is at most `max`. Never makes it bigger.
export function fitSize(width, height, max) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

// The photo and video saved for this exact step: { photo, video }, each '' when there is none. Media
// is { breakfastId: { stepNumber: { text, photo, video } } }, and a saved choice is ignored if the
// step's words are no longer the same.
export function stepMediaFor(media, breakfastId, stepNumber, text) {
  const saved = media[breakfastId]?.[stepNumber];
  if (!saved || saved.text !== text) return { photo: '', video: '' };
  return { photo: saved.photo || '', video: saved.video || '' };
}

// The media with this step's photo and video saved, or this step's entry removed when both are empty.
// Returns a new object.
export function setStepMedia(media, breakfastId, stepNumber, text, { photo, video }) {
  const { [stepNumber]: removed, ...others } = media[breakfastId] || {};
  const steps = photo || video ? { ...others, [stepNumber]: { text, photo, video } } : others;
  const next = { ...media, [breakfastId]: steps };
  if (Object.keys(steps).length === 0) delete next[breakfastId];
  return next;
}

// The media without any of this breakfast's steps (for when the breakfast is deleted).
export function removeBreakfastMedia(media, breakfastId) {
  const { [breakfastId]: removed, ...others } = media;
  return others;
}

// The photo that comes with the app for a step: { file, credit, link } or null. `photos` is keyed by
// the step's words (so the same step in two breakfasts shares one photo). A photo the student adds
// themselves is shown instead of this one.
export function builtInPhotoFor(photos, text) {
  return Object.hasOwn(photos, text) ? photos[text] : null;
}
