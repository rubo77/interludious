// Pod pickup and towing physics
import { Pod } from './game-objects.js';

export function createPod(x, y) {
  return new Pod(x, y);
}

export function checkPodPickup(ship, pod) {
  if (!pod.active) return false;
  
  const distance = Math.sqrt(
    (ship.x - pod.x) ** 2 + (ship.y - pod.y) ** 2
  );
  
  if (distance < 15) {
    pod.towed = true;
    return true;
  }
  
  return false;
}

export function updatePodTowing(ship, pod) {
  if (!pod.towed || !pod.active) return;
  
  // Pod follows ship with spring-like physics
  const dx = ship.x - pod.x;
  const dy = ship.y - pod.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const targetDistance = 20;
  const springStrength = 0.1;
  
  if (distance > targetDistance) {
    pod.x += dx * springStrength;
    pod.y += dy * springStrength;
  }
}

export function releasePod(pod) {
  pod.towed = false;
}
