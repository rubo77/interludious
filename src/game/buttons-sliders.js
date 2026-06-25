// Button and slider system
import { Button, Slider } from './game-objects.js';

export class ButtonSliderSystem {
  constructor() {
    this.buttons = [];
    this.sliders = [];
  }

  addButton(button) {
    this.buttons.push(button);
  }

  addSlider(slider) {
    this.sliders.push(slider);
  }

  update(shipX, shipY) {
    // Update all sliders
    for (const slider of this.sliders) {
      slider.update();
    }

    // Check button collisions
    for (const button of this.buttons) {
      if (button.checkCollision(shipX, shipY)) {
        button.pressed = true;
        this.activateSlider(button.sliderId);
      } else {
        button.pressed = false;
      }
    }
  }

  activateSlider(sliderId) {
    const slider = this.sliders.find(s => s.id === sliderId);
    if (slider) {
      slider.moving = !slider.moving; // Toggle movement
    }
  }

  linkButtonToSlider(buttonId, sliderId) {
    const button = this.buttons.find(b => b.id === buttonId);
    if (button) {
      button.sliderId = sliderId;
    }
  }
}
