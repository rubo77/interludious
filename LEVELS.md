# Level Format & Developer Notes

## Where levels are stored
- Level files live in `public/levels/levelN.def` (N = 1..6).
- They are fetched at runtime by `src/levels/level-loader.js` from `/levels/levelN.def`.
- Loading & parsing for gameplay happens in `src/ui/GameCanvas.jsx` (`loadAssets`).

## File format (`.def`)
The first **10 lines are metadata**, the rest is the tile layout.

```
82          ; line 0: width  (tiles)        -> used as lenx
60          ; line 1: height (tiles)
17          ; line 2: height of start       -> star/sky region
5           ; line 3: height of empty space
25          ; line 4: height of bedrock
189 24  33  ; line 5: palette background/tractor (R G B)
 24 211 24  ; line 6: palette gun/reactor/stand
 24 211 24  ; line 7: palette pod/blip
  0 164  0  ; line 8: palette text
 49 231 198 ; line 9: palette shield
<layout rows start at line 10>
```

- Each layout row is padded to `width` with spaces; rows are 16px tiles (`scaledSize = 16`).
- Trailing empty lines are stripped; space-only rows are kept (they are sky).

## Tile characters
| Char | Meaning |
|------|---------|
| (space) | empty / sky |
| `*` | restart point (pod delivery target) |
| `` ` `` | fuel |
| `m` | pod start marker — see note below |
| `0`–`4` | pod holder / stand |
| `p q r s t` | ground / platform tiles |
| `#` | marks the area when overflown, it sets the new respawn position |
| `d` | power plant |
| `L N` | buttons to open sliders |
| `@`–`K` | sliders |
| `P U [ \` | bunkers (rocket bases) |
| other a–z | decorative / object tiles |

## Collision
- The actual in-game renderer is `src/game/tile-renderer.js` (`TileRenderer`), tileset in `public/assets/blocks.json`.
- A tile counts as a **wall** when its char code is `>= 76` (`TileRenderer.isWall`).

## Pod holder note (important)
- The `m` marker has char code **109**, so `isWall('m')` is `true`. It also renders
  as a transparent ball in the tileset.
- On load we **strip `m` from the layout** (`m` -> space) so the pod does not explode
  the instant it leaves the holder, and the transparent ball is gone.
- The visible holder is built from the surrounding stand tiles (`0`–`4`), which stay
  in the layout. The pod start position is `m` minus `POD_HOLDER_OFFSET` (constants).

## Key constants
- Pod physics & rendering: `src/core/constants.js` (`POD_*`).
