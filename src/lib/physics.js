export const EVENT_HORIZON_RADIUS = 1.3;
export const DISK_INNER_RADIUS = 2.2;
export const DISK_OUTER_RADIUS = 4.1;

export function getDistanceToHorizon(stageIndex) {
  return Math.max(0.2, 4.2 - stageIndex * 0.65);
}

export function getVelocityMagnitude(stageIndex) {
  return Math.min(0.98, 0.05 + stageIndex * 0.11);
}

export function getTimeDilationFactor(stageIndex) {
  const speed = getVelocityMagnitude(stageIndex);
  return 1 / Math.sqrt(1 - speed * speed);
}

export function getDiskTemperature(stageIndex) {
  const normalized = Math.min(1, Math.max(0, stageIndex / 5));
  return 1200 + normalized * 2800;
}
