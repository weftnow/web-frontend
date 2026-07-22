export const PORTRAIT_STACKED_TRANSFORMS = [
  "translate3d(90px, 20px, 0) rotate(-15deg)",
  "translate3d(0, 0, 0) rotate(0deg)",
  "translate3d(-90px, 20px, 0) rotate(15deg)",
] as const;

export const PORTRAIT_SPREAD_TRANSFORMS = [
  "translate3d(0, 0, 0) rotate(0deg)",
  "translate3d(0, 0, 0) rotate(0deg)",
  "translate3d(0, 0, 0) rotate(0deg)",
] as const;

export function getPortraitTransforms(
  expanded: boolean,
  reducedMotion: boolean,
) {
  return expanded || reducedMotion
    ? PORTRAIT_SPREAD_TRANSFORMS
    : PORTRAIT_STACKED_TRANSFORMS;
}

export function getNextOpenIndex(current: number | null, requested: number) {
  return current === requested ? null : requested;
}

export function clampPreviewIndex(index: number, count: number) {
  if (count < 1) return 0;
  return Math.min(Math.max(index, 0), count - 1);
}
