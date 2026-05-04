type Listener = (...args: any[]) => void;

class SimpleEventEmitter {
  private listeners: Record<string, Listener[]> = {};

  addListener(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return {
      remove: () => {
        this.listeners[event] = (this.listeners[event] || []).filter(
          (cb) => cb !== callback
        );
      },
    };
  }

  emit(event: string, ...args: any[]) {
    (this.listeners[event] || []).forEach((cb) => cb(...args));
  }

  removeAllListeners(event?: string) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export const EventBus = new SimpleEventEmitter();
