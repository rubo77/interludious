import { describe, it, expect, beforeEach } from 'vitest';
import { ButtonSliderSystem } from '../../src/game/buttons-sliders.js';
import { Button, Slider } from '../../src/game/game-objects.js';

describe('Button Slider System', () => {
  let system;

  beforeEach(() => {
    system = new ButtonSliderSystem();
  });

  it('should create empty system', () => {
    expect(system.buttons).toHaveLength(0);
    expect(system.sliders).toHaveLength(0);
  });

  it('should add button', () => {
    const button = new Button(100, 200, 'slider1');
    system.addButton(button);
    expect(system.buttons).toHaveLength(1);
  });

  it('should add slider', () => {
    const slider = new Slider(100, 200, 'horizontal', 50);
    system.addSlider(slider);
    expect(system.sliders).toHaveLength(1);
  });

  it('should update sliders', () => {
    const slider = new Slider(100, 200, 'horizontal', 50);
    system.addSlider(slider);
    system.update(150, 250);
    expect(slider.x).toBe(100.5);
  });

  it('should detect button collision with ship', () => {
    const button = new Button(100, 200, 'slider1');
    button.id = 'button1';
    system.addButton(button);
    system.update(105, 205);
    expect(button.pressed).toBe(true);
  });

  it('should not detect collision when ship is far', () => {
    const button = new Button(100, 200, 'slider1');
    button.id = 'button1';
    system.addButton(button);
    system.update(300, 400);
    expect(button.pressed).toBe(false);
  });

  it('should toggle slider movement when button pressed', () => {
    const slider = new Slider(100, 200, 'horizontal', 50);
    slider.id = 'slider1';
    slider.moving = true;
    system.addSlider(slider);

    const button = new Button(100, 200, 'slider1');
    button.id = 'button1';
    system.addButton(button);

    system.update(105, 205);
    expect(slider.moving).toBe(false);
  });

  it('should link button to slider', () => {
    const button = new Button(100, 200, 'slider2');
    button.id = 'button1';
    system.addButton(button);

    const slider = new Slider(100, 200, 'horizontal', 50);
    slider.id = 'slider2';
    system.addSlider(slider);

    system.linkButtonToSlider('button1', 'slider2');
    expect(button.sliderId).toBe('slider2');
  });

  it('should handle multiple buttons and sliders', () => {
    const button1 = new Button(100, 200, 'slider1');
    const button2 = new Button(200, 300, 'slider2');
    system.addButton(button1);
    system.addButton(button2);

    const slider1 = new Slider(100, 200, 'horizontal', 50);
    const slider2 = new Slider(200, 300, 'vertical', 50);
    system.addSlider(slider1);
    system.addSlider(slider2);

    system.update(105, 205);
    expect(button1.pressed).toBe(true);
    expect(button2.pressed).toBe(false);
  });
});
