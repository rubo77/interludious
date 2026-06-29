# Interludious - Modern Space Game

A modern, smooth, and anti-aliased space game built with React, Vite, and HTML5 Canvas. Features modern graphics with particle effects, smooth camera, and responsive design.

![Interludious](https://img.shields.io/badge/Interludious-Modern%20Space%20Game-blue)
![React](https://img.shields.io/badge/React-18.0.0-green)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)
![Vitest](https://img.shields.io/badge/Vitest-1.0.0-yellow)

## Features

- **Modern Graphics**: Smooth anti-aliased rendering with particle effects and screen shake
- **Complete Gameplay**: All 6 levels with accurate physics and mechanics
- **Pod Towing**: Tractor beam mechanics for picking up and towing the pod
- **Bunkers & Bullets**: Enemy bunkers that shoot at your ship
- **Buttons & Sliders**: Interactive level elements
- **Level Selection**: Direct level access via buttons
- **High Score System**: Persistent high scores using localStorage
- **Responsive Design**: Works on desktop and mobile
- **Touch Controls**: Mobile-friendly touch controls
- **Keyboard Shortcuts**: Quick access to game functions

## Controls

### Keyboard

| Key | Action |
|-----|--------|
| ↑ / W | Accelerate |
| ← / A | Rotate Left |
| → / D | Rotate Right |
| Space / Ctrl | Tractor Beam / Pod |
| X / Shift | Shoot |

### Touch / Joystick Control

Works with mouse and touch: starting from the touch point, moving right rotates the ship right, moving left rotates left, moving up accelerates.
**Explanation:**
It resets only the horizontal zero position (`joystickStart.x`) when horizontal movement stops, while keeping vertical movement independent. This way:
- Horizontal rotation only happens while actively moving left/right
- Vertical acceleration can continue independently
- e.g. If user slides right-up then continues only up, the horizontal zero position resets to stop rotation


### Game Over Screen

| Key | Action |
|-----|--------|
| Space | Play Again |
| Esc | Back to Menu |

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/interludious.git
cd interludious

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Gameplay

### Objective

The goal is to fly your ship through each level, pick up the pod using your tractor beam, and deliver it to the restart point. Once the pod is docked, fly into the sky to complete the level.

### Level Completion

1. **Pick up the pod**: Get close to the pod and press Space to activate the tractor beam
2. **Deliver to restart point**: Fly to the restart point (marked with a special tile)
3. **Fly into sky**: With the pod towed, fly upward into the sky to complete the level

### Hazards

- **Bunkers**: Enemy bunkers shoot bullets at your ship
- **Gravity**: Your ship is affected by gravity
- **Fuel**: Acceleration consumes fuel - collect fuel pickups to replenish
- **Walls**: Collision with walls causes damage

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Vitest**: Testing framework
- **Playwright**: E2E testing
- **HTML5 Canvas**: Game rendering
- **Capacitor**: Mobile app support

## Project Structure

```
interludious/
├── src/
│   ├── core/           # Game constants and utilities
│   ├── game/           # Game objects (Ship, Pod, Bunker, etc.)
│   ├── levels/         # Level definitions and loader
│   ├── physics/        # Collision detection
│   ├── ui/             # React components (GameCanvas, HUD, Menu)
│   └── main.jsx        # Application entry point
├── assets/             # Game assets (tilesets, sounds)
├── levels/             # Level definition files
├── tests/              # Unit and E2E tests
└── public/             # Static files
```

## Testing

```bash
# Run all tests
npm test

# Run with timeout (recommended)
timeout 100 npm test

# Run E2E tests
npx playwright test
```

## Mobile Support

The game supports mobile devices with touch controls and Capacitor for native app deployment.

### Build Mobile Apps

```bash
# Build iOS app
npx cap sync ios
npx cap open ios

# Build Android app
npx cap sync android
npx cap open android
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is a modern space game. All rights reserved.

## Credits

- Development: Interludious Team
- Level Design: Interludious Levels

---

**Enjoy the modern space game experience!** 🚀
