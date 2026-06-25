// App lifecycle management
export class AppLifecycle {
  constructor() {
    this.listeners = [];
    this.state = 'active'; // active, inactive, background
  }

  async init(capacitorManager) {
    const App = await capacitorManager.App();
    if (App) {
      App.addListener('appStateChange', this.handleStateChange.bind(this));
    }
  }

  handleStateChange(state) {
    this.state = state.isActive ? 'active' : 'inactive';
    this.notifyListeners(this.state);
  }

  getState() {
    return this.state;
  }

  isActive() {
    return this.state === 'active';
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  notifyListeners(state) {
    this.listeners.forEach(callback => callback(state));
  }

  destroy() {
    this.listeners = [];
  }
}
