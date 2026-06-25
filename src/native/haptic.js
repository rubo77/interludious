// Haptic feedback for native devices
export class HapticFeedback {
  constructor() {
    this.enabled = false;
  }

  async init(capacitorManager) {
    const Haptics = await capacitorManager.Haptics();
    if (Haptics && capacitorManager.isNativePlatform()) {
      this.enabled = true;
      this.Haptics = Haptics;
    }
  }

  async impact(style = 'medium') {
    if (!this.enabled || !this.Haptics) return;
    
    try {
      await this.Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic impact failed:', error);
    }
  }

  async notification(type = 'success') {
    if (!this.enabled || !this.Haptics) return;
    
    try {
      await this.Haptics.notification({ type });
    } catch (error) {
      console.error('Haptic notification failed:', error);
    }
  }

  async selectionChanged() {
    if (!this.enabled || !this.Haptics) return;
    
    try {
      await this.Haptics.selectionChanged();
    } catch (error) {
      console.error('Haptic selection changed failed:', error);
    }
  }

  async selectionStart() {
    if (!this.enabled || !this.Haptics) return;
    
    try {
      await this.Haptics.selectionStart();
    } catch (error) {
      console.error('Haptic selection start failed:', error);
    }
  }

  async selectionEnd() {
    if (!this.enabled || !this.Haptics) return;
    
    try {
      await this.Haptics.selectionEnd();
    } catch (error) {
      console.error('Haptic selection end failed:', error);
    }
  }

  isEnabled() {
    return this.enabled;
  }
}
