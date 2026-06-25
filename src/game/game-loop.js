// Game loop using requestAnimationFrame
export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.timeStep = 1000 / 60; // 60 FPS
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
  }

  loop(currentTime = performance.now()) {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.accumulator += deltaTime;

    while (this.accumulator >= this.timeStep) {
      this.update(this.timeStep);
      this.accumulator -= this.timeStep;
    }

    this.render(this.accumulator / this.timeStep);

    requestAnimationFrame((time) => this.loop(time));
  }

  isRunning() {
    return this.running;
  }
}
