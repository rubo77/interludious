import { describe, it, expect, beforeEach } from 'vitest';
import { CollisionDetection } from '../../src/physics/collision.js';
import { TileRenderer } from '../../src/game/tile-renderer.js';
import { Pod } from '../../src/game/pod.js';

// Regression tests for the pod holder / docking bug:
// The pod marker 'm' (char code 109) is classified as a wall by TileRenderer
// (code >= 76), so the pod exploded the instant it left the holder. Removing
// the 'm' marker from the layout fixes both the collision and the rendered ball.
describe('Pod holder docking regression', () => {
  let collision;
  let tileRenderer;

  beforeEach(() => {
    tileRenderer = new TileRenderer(); // isWall/getTileAt do not require loaded tiles
    collision = new CollisionDetection(tileRenderer);
  });

  it('treats the raw pod marker "m" as a wall (root cause of the explosion)', () => {
    expect(tileRenderer.isWall('m')).toBe(true);
  });

  it('explodes the pod when it sits on an un-cleaned "m" holder tile', () => {
    // Pod centered on the 'm' tile (scaled tile size = 16, so center at 8,8)
    const level = { layout: ['m'], width: 1, height: 1 };
    const pod = new Pod(8, 8);
    pod.onHolder = false; // off the holder -> collision is checked
    const result = collision.checkPodCollision(pod, level);
    expect(result.collided).toBe(true);
  });

  it('does NOT explode the pod once the "m" marker is removed from the layout', () => {
    // Same position, but the layout has been cleaned (m -> space)
    const cleaned = ['m'].map(row => row.replace(/m/g, ' '));
    const level = { layout: cleaned, width: 1, height: 1 };
    const pod = new Pod(8, 8);
    pod.onHolder = false;
    const result = collision.checkPodCollision(pod, level);
    expect(result.collided).toBe(false);
  });

  it('never reports collision while the pod is on the holder (handled by caller via onHolder)', () => {
    // The game skips checkPodCollision entirely while onHolder is true; this
    // documents that the pod stays safe at its start position on the holder.
    const pod = new Pod(8, 8);
    expect(pod.onHolder).toBe(true);
  });
});
