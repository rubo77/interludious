// Back button handling for Android
export class BackButtonHandler {
  constructor() {
    this.listeners = [];
    this.enabled = false;
  }

  async init(capacitorManager) {
    const App = await capacitorManager.App();
    if (App && capacitorManager.isAndroid()) {
      this.enabled = true;
      App.addListener('backButton', this.handleBackButton.bind(this));
    }
  }

  handleBackButton() {
    for (const listener of this.listeners) {
      if (listener()) {
        return; // Listener handled the back button
      }
    }
    // If no listener handled it, exit app
    this.exitApp();
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

  async exitApp() {
    // In web environment, this is a no-op
    // In native environment, this would call App.exitApp()
    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins) {
      const App = window.Capacitor.Plugins.App;
      if (App && App.exitApp) {
        App.exitApp();
      }
    }
  }

  destroy() {
    this.listeners = [];
    this.enabled = false;
  }
}
