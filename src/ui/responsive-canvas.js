// Responsive canvas sizing
export class ResponsiveCanvas {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.aspectRatio = 4 / 3;
    this.resizeObserver = null;
  }

  init() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
  }

  resize() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    
    let canvasWidth, canvasHeight;
    
    if (containerWidth / containerHeight > this.aspectRatio) {
      // Container is wider than aspect ratio
      canvasHeight = containerHeight;
      canvasWidth = canvasHeight * this.aspectRatio;
    } else {
      // Container is taller than aspect ratio
      canvasWidth = containerWidth;
      canvasHeight = canvasWidth / this.aspectRatio;
    }
    
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;
  }

  setAspectRatio(ratio) {
    this.aspectRatio = ratio;
    this.resize();
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }
}
