export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const getDopplerTint = (velocity, viewDir) => {
  const forwardBias = clamp(velocity.dot(viewDir), -1, 1);
  const towardCamera = smoothstep(-1, 1, forwardBias);
  const brightness = 0.7 + towardCamera * 0.5;
  const tint = towardCamera > 0.5
    ? { r: 0.95, g: 0.97, b: 1.0, intensity: brightness }
    : { r: 0.9, g: 0.48, b: 0.25, intensity: 0.65 + brightness * 0.15 };
  return tint;
};
