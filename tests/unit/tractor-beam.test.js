import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TractorBeam } from '../../src/graphics/tractor-beam.js';

describe('Tractor Beam', () => {
  let beam;
  let mockCtx;

  beforeEach(() => {
    beam = new TractorBeam();
    
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      strokeStyle: null,
      lineWidth: 2,
      lineCap: 'round',
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fillStyle: null,
      arc: vi.fn(),
      fill: vi.fn()
    };
  });

  it('should create inactive beam', () => {
    expect(beam.active).toBe(false);
  });

  it('should activate beam with positions', () => {
    beam.activate(100, 200, 150, 250);
    expect(beam.active).toBe(true);
    expect(beam.shipX).toBe(100);
    expect(beam.shipY).toBe(200);
    expect(beam.podX).toBe(150);
    expect(beam.podY).toBe(250);
  });

  it('should deactivate beam', () => {
    beam.activate(100, 200, 150, 250);
    beam.deactivate();
    expect(beam.active).toBe(false);
  });

  it('should update positions when active', () => {
    beam.activate(100, 200, 150, 250);
    beam.update(110, 210, 160, 260);
    expect(beam.shipX).toBe(110);
    expect(beam.shipY).toBe(210);
    expect(beam.podX).toBe(160);
    expect(beam.podY).toBe(260);
  });

  it('should update pulse phase', () => {
    beam.activate(100, 200, 150, 250);
    const initialPhase = beam.pulsePhase;
    beam.update(100, 200, 150, 250);
    expect(beam.pulsePhase).toBeGreaterThan(initialPhase);
  });

  it('should not update when inactive', () => {
    beam.update(100, 200, 150, 250);
    expect(beam.shipX).toBe(0);
    expect(beam.shipY).toBe(0);
  });

  it('should render when active', () => {
    beam.activate(100, 200, 150, 250);
    beam.render(mockCtx);
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 200);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(150, 250);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should not render when inactive', () => {
    beam.render(mockCtx);
    expect(mockCtx.save).not.toHaveBeenCalled();
  });

  it('should draw connection points', () => {
    beam.activate(100, 200, 150, 250);
    beam.render(mockCtx);
    expect(mockCtx.arc).toHaveBeenCalledWith(100, 200, 4, 0, Math.PI * 2);
    expect(mockCtx.arc).toHaveBeenCalledWith(150, 250, 4, 0, Math.PI * 2);
  });
});
