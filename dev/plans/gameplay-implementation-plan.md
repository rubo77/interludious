# Gameplay Implementation Plan

## Current Status (Completed)
- ✅ Phase 1-10: All original phases completed
- ✅ UI Implementation: Menu, HUD, GameCanvas components
- ✅ Ship Implementation: Physics, rendering, keyboard control
- ✅ Level Rendering: Basic LevelRenderer created
- ✅ Level Loading: Original .def files imported
- ✅ High Score System: localStorage persistence
- ✅ Playwright E2E: Tests configured
- ✅ Native Projects: iOS and Android generated

## Remaining Tasks

### Task 1: Level Rendering - Wände und Level-Layout anzeigen

**Problem**: Current level rendering shows only points, not proper walls. The original Thrust format uses p/q/r/s/t tiles for platforms with different heights.

**Steps**:
1. Update LevelRenderer to render p/q/r/s/t platform tiles correctly
   - p: Platform - lowest (2px height)
   - q: Platform - low (3px height)
   - r: Platform - medium (4px height)
   - s: Platform - high (5px height)
   - t: Platform - highest (6px height)
2. Update isWall() method to treat platforms as collision surfaces
3. Update GameCanvas level loading to parse .def format correctly
   - Skip metadata lines (comments, dimensions)
   - Extract ASCII layout only
4. Add tests for platform rendering
5. Scale tile size appropriately for visibility (increase from 8px to 16px or 32px)
6. Add camera/viewport to handle large level sizes (82x60 tiles)
7. Commit: Level rendering with proper platform tiles

**Files to modify**:
- `src/game/level-renderer.js` - Add platform rendering, fix isWall()
- `src/ui/GameCanvas.jsx` - Fix level loading, add camera/viewport
- `tests/unit/level-renderer.test.js` - Add platform tile tests

### Task 2: Kollisionserkennung - Schiff kollidiert mit Wänden

**Steps**:
1. Complete CollisionDetection class implementation
2. Add platform collision (p/q/r/s/t tiles are solid)
3. Implement proper collision response
   - Bounce ship off walls
   - Stop ship velocity on collision
   - Push ship back out of wall
4. Integrate collision detection in GameCanvas render loop
5. Add visual feedback on collision (flash or sound)
6. Write tests for collision with platforms
7. Commit: Ship collides with walls and platforms

**Files to modify**:
- `src/physics/collision.js` - Complete implementation, add platform support
- `src/ui/GameCanvas.jsx` - Integrate collision detection
- `tests/unit/collision.test.js` - Add platform collision tests

### Task 3: Pod Towing - Das Schiff kann den Pod schleppen

**Steps**:
1. Create Pod class with physics
   - Position, velocity, towing state
   - Gravity affects pod when not towing
2. Implement tractor beam mechanics
   - Detect when ship is near pod
   - Activate tractor beam with key press (Space)
   - Pull pod towards ship when towing
3. Implement pod collision with walls
   - Pod bounces off walls
   - Pod gets stuck if pushed into wall
4. Visual effects for tractor beam
   - Draw beam line between ship and pod
   - Glowing effect when towing
5. Add pod rendering in GameCanvas
6. Write tests for pod physics and towing
7. Commit: Pod can be picked up and towed

**Files to create**:
- `src/game/pod.js` - Pod class with physics
- `tests/unit/pod.test.js` - Pod unit tests

**Files to modify**:
- `src/ui/GameCanvas.jsx` - Add pod rendering and tractor beam
- `src/physics/collision.js` - Add pod collision

### Task 4: Game Loop - Vollständiges Gameplay mit Level-Progression

**Steps**:
1. Implement level progression system
   - Track current level (1-6)
   - Load next level on completion
   - Score tracking per level
2. Implement win condition with pod docking
   - Deliver pod to restart point (*)
   - Pod must dock (stop and attach to restart point)
   - Screen scrolls up when pod docks
   - Pod flies up into the sky on level complete
   - Advance to next level after animation
3. Implement lose condition
   - Ship hits bunker bullet
   - Ship hits dangerous object
   - Fuel runs out
   - Lives decrement
   - Game over after 3 lives
4. Implement fuel system
   - Fuel decreases when thrusting
   - Collect fuel from `` tiles
   - Game over if fuel runs out
5. Implement restart points
   - Ship respawns at * on death
   - Pod resets to m position
6. Implement bunker shooting (optional for basic gameplay)
   - Bunkers shoot bullets at ship
   - Ship can be hit by bullets
7. Integrate all systems in GameCanvas
8. Add game state management (menu, playing, level complete, game over)
9. Add level selection buttons on right side
   - Direct level start buttons
   - Display level numbers
   - Show completion status
10. Write integration tests for complete gameplay
11. Commit: Complete gameplay with level progression and pod docking animation

**Files to modify**:
- `src/ui/GameCanvas.jsx` - Integrate all game systems, add pod docking animation
- `src/ui/App.jsx` - Add game state management, add level selection buttons
- `src/game/game-state.js` - Add level progression logic
- `tests/integration/gameplay-integration.test.js` - Integration tests

## Implementation Order
1. Task 1: Level Rendering (fix display issues first)
2. Task 2: Collision Detection (walls must work before pod)
3. Task 3: Pod Towing (core mechanic)
4. Task 4: Game Loop (tie everything together)

## Success Criteria
- ✅ Levels display with proper platform tiles
- ✅ Ship collides with walls and bounces appropriately
- ✅ Pod can be picked up and towed with tractor beam
- ✅ Player can complete levels and progress through all 6 levels
- ✅ Fuel system works (thrust consumes fuel, collect fuel)
- ✅ Lives system works (3 lives, respawn at restart point)
- ✅ Score tracking works
- ✅ All tests pass
