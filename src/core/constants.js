// Game constants ported from thrust_t.h
export const GRAVITY = 0.055; // 10% stronger than original
export const THRUST_POWER = 0.05;
export const ROTATION_SPEED = 0.05; // 50% slower than original
export const MAX_SPEED = 5;
export const FRICTION = 0.99;
export const SHIELD_DURATION = 300; // frames
export const FUEL_MAX = 100;
export const FUEL_CONSUMPTION = 0.1;
export const SKY_THRESHOLD_OFFSET = 400; // pixels above level top (y=0) to trigger sky event
export const GAME_SPEED = 0.5; // Global game speed multiplier (1.0 = full speed, 0.5 = half speed)

// Pod physics
export const POD_MASS_FACTOR = 2; // Pod is 2x heavier than the ship (affects tow physics / center of mass)
export const POD_GRAVITY = 0.055; // Gravity applied to the pod when free-falling (off the holder)
export const POD_TETHER_LENGTH = 50; // Rest length of the tow tether (pixels)
export const POD_TETHER_STIFFNESS = 0.18; // Spring stiffness of the tow tether
export const POD_TETHER_DAMPING = 0.12; // Damping of the tow tether to prevent oscillation
export const POD_HOLDER_OFFSET = 14; // Pixels the pod sits ABOVE its holder marker (avoids holder collision)

