# Thrust Cross-Platform Porting Plan

## Overview
Port the dulsi/thrust C64 clone to a modern web application using HTML5 Canvas + JavaScript, with native iOS and Android app support via Capacitor. Maximize code reuse from the existing C codebase.

## Architecture

### Tech Stack
- **Framework**: React (for UI components, menus, game state management)
- **Rendering**: HTML5 Canvas API (replaces SDL graphics)
- **Physics**: Ported C physics engine to JavaScript
- **Audio**: Web Audio API (replaces SDL sound)
- **Build**: Vite (fast dev server, bundling)
- **Mobile Wrapper**: Capacitor (iOS + Android native apps with WebView)
- **Touch Controls**: Virtual joystick + buttons for mobile
- **Gravity Sensor**: DeviceOrientation/DeviceMotion API for tilt-based control (optional)

### Project Structure
```
/var/www/Thrust/
├── src/
│   ├── core/
│   │   ├── physics.js        # Ported from thrust.c (gravity, thrust, inertia)
│   │   ├── level-parser.js   # Ported from level.c (def file parsing)
│   │   ├── game-objects.js   # Ported from things.c (bunkers, buttons, sliders)
│   │   └── collision.js      # Ported collision detection
│   ├── graphics/
│   │   ├── renderer.js       # Canvas rendering (replaces SDL)
│   │   ├── sprites.js        # Sprite management (converted from datasrc/)
│   │   └── effects.js        # Particle effects, explosions
│   ├── audio/
│   │   ├── sound-engine.js   # Web Audio API wrapper
│   │   └── sounds.js         # Sound definitions (converted from .snd files)
│   ├── input/
│   │   ├── keyboard.js       # Keyboard event handling (replaces doskey.c)
│   │   ├── touch.js          # Virtual joystick + touch controls
│   │   └── gravity.js        # DeviceOrientation/DeviceMotion API for tilt control
│   ├── game/
│   │   ├── game-loop.js      # requestAnimationFrame loop
│   │   ├── game-state.js     # Score, lives, level progression
│   │   └── constants.js      # Game constants (port from thrust_t.h)
│   ├── ui/
│   │   ├── App.jsx           # Main React component
│   │   ├── GameCanvas.jsx    # Canvas component
│   │   ├── Menu.jsx          # Start menu
│   │   ├── HUD.jsx           # Score, fuel display
│   │   └── TouchControls.jsx # Virtual joystick overlay
│   └── main.jsx              # Entry point
├── public/
│   └── assets/
│       ├── sprites/          # Converted sprite images
│       └── levels/           # Original .def level files
├── capacitor.config.ts        # Capacitor configuration
├── android/                   # Generated Android native project
├── ios/                       # Generated iOS native project
├── package.json
└── vite.config.js
```

## Code Reuse Strategy

### 1. Level Format (100% Reuse)
**Source**: `datasrc/level1.def`, `level2.def`, etc.

The ASCII-based level format is perfect for web:
- Keep `.def` files unchanged
- Port `level.c::readbana()` to JavaScript
- Parse dimensions, colors, and level layout identically

**Mapping**:
- `#` → Solid wall/barrier
- `*` → Restart point
- `@`-`K` → Sliders (12 types)
- `L`, `N` → Buttons
- `P`, `U`, `[`, `\` → Bunkers (4 types)
- `` ` `` → Fuel
- `d` → Power plant
- `m` → Pod position

### 2. Physics Engine (90% Reuse)
**Source**: `src/thrust.c`

Port these core physics functions to JavaScript:
- Ship movement (x, y, vx, vy with gravity)
- Thrust calculation (alpha, deltaalpha)
- Collision detection (insideblock, pixel-perfect)
- Pod towing physics (loadcontact, loadpoint)

**Constants to port** (from `thrust_t.h`):
- BBILDX, BBILDY (block dimensions)
- maxlenx, maxleny (max level size)
- Gravity constant
- Thrust power

### 3. Game Objects (85% Reuse)
**Source**: `src/things.c`

Port these structures and functions:
- `thing` struct → JavaScript class/object
- `slider` struct → JavaScript class with animation
- `bullet` struct → Projectile system
- `fragment` struct → Particle system
- Object types: FUEL, POWERPLANT, BUNKER1-4, BUTTON1-2

**Functions to port**:
- `newthing()`, `newslider()`, `newbullet()`
- `animatesliders()`, `movebullets()`, `movefragments()`
- `bunkerfirebullet()`, `hit()`, `explodething()`

### 4. Game Logic (80% Reuse)
**Source**: `src/thrust.c`, `src/level.c`

Port:
- Game state variables (score, lives, fuel, shield)
- Level progression logic
- Restart point system
- Barrier/restart point matching
- Power plant logic

## Implementation Phases

### Phase 1: Foundation (Core Physics)
1. Set up React + Vite project
2. Create Canvas renderer component
3. Port level parser from `level.c`
4. Implement basic ship physics (gravity, thrust, rotation)
5. Add keyboard input handling

**Deliverable**: Ship can fly in a level with gravity

### Phase 2: Game Objects
1. Port `things.c` structures to JavaScript
2. Implement bunker types and shooting logic
3. Add button/slider system
4. Implement fuel pickup
5. Add pod pickup and towing physics

**Deliverable**: Complete game objects with interactions

### Phase 3: Modern Graphics & Effects
1. Create modern vector-based or high-res sprite assets (ship, pod, bunkers, bullets)
2. Implement smooth antialiased rendering on Canvas
3. Add particle effects (explosions, engine flame with glow)
4. Implement shield visual effect with transparency/glow
5. Add tractor beam visualization with smooth gradients
6. Create modern tileset for level walls (smooth edges, gradients)

**Deliverable**: Modern, polished graphics with antialiasing

### Phase 4: Audio
1. Convert sound files from `.snd` to Web Audio format
2. Implement Web Audio API sound engine
3. Add engine thrust sound
4. Add shooting, explosion, pickup sounds
5. Add background music (optional)

**Deliverable**: Complete audio experience

### Phase 5: Game Loop & UI
1. Implement proper game loop with requestAnimationFrame
2. Add scoring system
3. Add lives and game over logic
4. Create main menu and level selection
5. Add HUD (fuel, score, shield status)

**Deliverable**: Complete playable game

### Phase 6: Mobile & Cross-Platform
1. Add all 6 original levels
2. Implement high score system (localStorage)
3. Add virtual joystick + touch controls (REQUIRED for mobile)
4. Implement gravity sensor control (DeviceOrientation/DeviceMotion API)
5. Add control settings menu (keyboard/touch/gravity selection)
6. Implement responsive canvas sizing for different screen sizes
7. Add device orientation lock (landscape only)
8. Add prevent-default for touch events (no zoom/scroll)
9. Performance optimization for mobile devices
10. Cross-browser and cross-device testing

**Deliverable**: Web app ready for mobile browsers

### Phase 7: Capacitor Setup (Native Apps)
1. Install and configure Capacitor
2. Set up iOS project (Xcode configuration)
3. Set up Android project (Android Studio configuration)
4. Configure app icons and splash screens
5. Set up app metadata (name, version, bundle ID)
6. Configure permissions (if needed)
7. Test in iOS Simulator
8. Test on Android Emulator

**Deliverable**: Native iOS and Android projects configured

### Phase 8: Native App Polish
1. Implement native back button handling (Android)
2. Add native app lifecycle handling (pause/resume)
3. Optimize for mobile performance (reduce memory usage)
4. Add haptic feedback for collisions/pickups
5. Test on real iOS devices
6. Test on real Android devices
7. Fix platform-specific bugs

**Deliverable**: Production-ready native apps

### Phase 9: App Store Deployment
1. Prepare screenshots and app store descriptions
2. Configure iOS App Store Connect metadata
3. Configure Google Play Store metadata
4. Create app icons for all required sizes
5. Generate signed APK/AAB for Android
6. Generate IPA for iOS
7. Submit to Apple App Store
8. Submit to Google Play Store

**Deliverable**: Apps published to both stores

## Asset Creation

### Modern Sprites
Create new high-resolution or vector-based assets:
- **Ship**: Modern design with 16 rotation angles, smooth edges, engine glow
- **Pod**: Sleek energy pod design with glow effects
- **Bunkers**: 4 types with modern sci-fi aesthetics
- **Bullets**: Smooth projectile designs with trail effects
- **Shield**: Transparent/glowing shield overlay
- **Walls**: Modern tileset with smooth edges, gradients, and textures
- **Particles**: Explosion, engine flame, spark effects with glow

**Tools**: Use vector graphics (SVG) or high-res PNG with transparency, optimize for Canvas rendering

### Sounds
Convert from `.snd` files:
- `engine.snd` → Engine thrust sound
- `blip.snd` → Pod pickup sound
- `boom.snd`, `boom2.snd` → Explosion sounds
- `zero.snd` → Shooting sound
- `harp.snd` → Background music (optional)

### Levels
Copy `.def` files unchanged:
- `level1.def` through `level6.def`

## Key Technical Decisions

### 1. Coordinate System
Keep the original 8-units-per-pixel system for physics accuracy, scale for rendering:
- Physics: Internal coordinates (8x precision)
- Rendering: Scale down by 8 for display

### 2. Game Loop
Use `requestAnimationFrame` with delta time for consistent physics:
```javascript
function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  updatePhysics(dt);
  render();
  requestAnimationFrame(gameLoop);
}
```

### 3. Collision Detection
Port the pixel-perfect collision from `thrust.c::insideblock()` using Canvas pixel data or bitmask arrays.

### 4. State Management
Use React for UI state (menus, HUD), but keep game physics in pure JavaScript for performance.

### 5. Gravity Sensor Control
Use DeviceOrientation/DeviceMotion API for tilt-based control:

**DeviceOrientation (rotation):**
- `event.alpha` - Z-axis rotation (0-360°)
- `event.beta` - X-axis rotation (-180 to 180°, front/back tilt)
- `event.gamma` - Y-axis rotation (-90 to 90°, left/right tilt)

**Mapping to Thrust:**
- `gamma` (left/right tilt) → Ship rotation
- `beta` (front/back tilt) → Thrust (forward tilt = thrust)
- Threshold values to prevent accidental inputs
- Calibration option for neutral position

**iOS 13+ Permission:**
```javascript
// Request permission for iOS 13+
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    });
}
```

**Fallback:**
- If sensor not available → Default to virtual joystick
- User can select control type in settings menu

## Implementation Priority
Phases are ordered by dependency - each phase builds on the previous one.

## AI Vibecoding Optimization

### Incremental Deliverables
Each phase produces a working, testable component:

**Phase 1 Deliverable**: Flying ship in a level with gravity
**Phase 2 Deliverable**: Complete game objects with interactions
**Phase 3 Deliverable**: Visual polish matching original
**Phase 4 Deliverable**: Complete audio experience
**Phase 5 Deliverable**: Complete playable game
**Phase 6 Deliverable**: Web app ready for mobile browsers
**Phase 7 Deliverable**: Native iOS and Android projects configured
**Phase 8 Deliverable**: Production-ready native apps
**Phase 9 Deliverable**: Apps published to both stores

### Clear Dependencies
- Phase 2 depends on Phase 1 (physics needed for game objects)
- Phase 3 depends on Phase 2 (objects needed for rendering)
- Phase 4 is independent (can be done in parallel)
- Phase 5 depends on Phase 2-3 (game loop needs objects + rendering)
- Phase 6 depends on Phase 5 (mobile needs working game)
- Phase 7 depends on Phase 6 (Capacitor needs web app)
- Phase 8 depends on Phase 7 (polish needs native projects)
- Phase 9 depends on Phase 8 (deployment needs polished apps)

### Testable Milestones
After each phase, run the game to verify:
- Phase 1: Ship flies, gravity works
- Phase 2: Bunkers shoot, buttons work, pod tows
- Phase 3: Sprites render, effects play
- Phase 4: Sounds play correctly
- Phase 5: Full game loop works
- Phase 6: Touch/gravity controls work on mobile
- Phase 7: Native apps build and run
- Phase 8: Native apps polished
- Phase 9: Apps submitted to stores

## Advantages of This Approach
1. **Maximum Code Reuse**: ~70-80% of game logic can be ported directly
2. **Authentic Gameplay**: Physics and level design remain identical to original
3. **Modern Tech Stack**: React + Canvas for maintainability
4. **Asset Reuse**: Level files and sprite data can be converted
5. **Proven Logic**: dulsi/thrust is a mature, bug-free implementation
6. **Single Codebase**: Web, iOS, and Android from one codebase via Capacitor
7. **Native Performance**: Capacitor WebView provides near-native performance
8. **Easy Updates**: Web app updates automatically, native apps via store updates
9. **Cost Effective**: No need for separate native development teams

## Risks & Mitigations
- **Performance**: JavaScript physics may be slower than C → Optimize with typed arrays, reduce GC pressure
- **Audio**: Web Audio API complexity → Use simple wrapper library, handle mobile audio context restrictions
- **Mobile Touch Controls**: Virtual joystick implementation → Test extensively on real devices, add haptic feedback
- **Gravity Sensor Support**: DeviceOrientation API varies by device → Test on multiple devices, add fallback to touch controls
- **iOS Sensor Permission**: iOS 13+ requires user permission → Implement permission request flow, handle denial gracefully
- **Browser Compatibility**: Test across browsers, use polyfills if needed
- **iOS WebView Performance**: May be slower than Safari → Optimize rendering, use GPU acceleration
- **Android Fragmentation**: Different screen sizes/densities → Responsive design, test on multiple devices
- **App Store Approval**: Apple review process → Follow guidelines, avoid rejected patterns
- **Memory Constraints**: Mobile devices have limited RAM → Optimize sprite loading, use object pooling
- **Audio Context on Mobile**: Requires user interaction → Initialize audio on first touch/start button
- **Orientation Issues**: Mobile devices rotate → Lock to landscape, handle orientation changes gracefully
