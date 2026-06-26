# Thrust - Modern Web Port

A modern, smooth, and anti-aliased web port of the classic Thrust game, built with React, Vite, and HTML5 Canvas. Features modern graphics with particle effects, smooth camera, and responsive design.

![Thrust](https://img.shields.io/badge/Thrust-Modern%20Port-blue)
![React](https://img.shields.io/badge/React-18.0.0-green)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)
![Vitest](https://img.shields.io/badge/Vitest-1.0.0-yellow)

## Features

- **Modern Graphics**: Smooth anti-aliased rendering with particle effects and screen shake
- **Complete Gameplay**: All 6 original levels with accurate physics and mechanics
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
| ↑ / W | Thrust |
| ← / A | Rotate Left |
| → / D | Rotate Right |
| Space | Tractor Beam / Pod |
| X | Shoot |

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
git clone https://github.com/yourusername/thrust.git
cd thrust

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
- **Fuel**: Thrust consumes fuel - collect fuel pickups to replenish
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
thrust/
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

This project is a modern web port of the original Thrust game. The original game rights belong to their respective owners.

## Acknowledgments

- Original Thrust game by Jeremy Smith
- Modern web port with React and Canvas API
- Level data from the original Thrust game

## Credits

- Development: Modern Web Port Team
- Original Game: Jeremy Smith
- Level Design: Original Thrust Levels

---

**Enjoy the modern Thrust experience!** 🚀
