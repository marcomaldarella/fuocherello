import { run } from "@/lib/canvas-utils";

const IS_MOBILE = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const CHUNK_SIZE = 110;
export const RENDER_DISTANCE = IS_MOBILE ? 1 : 2;
export const CHUNK_FADE_MARGIN = 1;
export const MAX_VELOCITY = 3.2;
export const DEPTH_FADE_START = IS_MOBILE ? 100 : 140;
export const DEPTH_FADE_END = IS_MOBILE ? 180 : 260;
export const INVIS_THRESHOLD = 0.01;
export const KEYBOARD_SPEED = 0.18;
export const VELOCITY_LERP = 0.16;
export const VELOCITY_DECAY = 0.9;
export const INITIAL_CAMERA_Z = 50;

export type ChunkOffset = {
  dx: number;
  dy: number;
  dz: number;
  dist: number;
};

export const CHUNK_OFFSETS: ChunkOffset[] = run(() => {
  const maxDist = RENDER_DISTANCE + CHUNK_FADE_MARGIN;
  const offsets: ChunkOffset[] = [];
  for (let dx = -maxDist; dx <= maxDist; dx++) {
    for (let dy = -maxDist; dy <= maxDist; dy++) {
      for (let dz = -maxDist; dz <= maxDist; dz++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
        if (dist > maxDist) continue;
        offsets.push({ dx, dy, dz, dist });
      }
    }
  }
  return offsets;
});
