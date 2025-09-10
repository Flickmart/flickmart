/** biome-ignore-all lint/style/useBlockStatements: <if statements and early returns would suffice> */
export interface ServiceWorkerRegistrationOptions {
  scope?: string;
  updateViaCache?: ServiceWorkerUpdateViaCache;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  // biome-ignore lint/style/useReadonlyClassProperties: <registration is refrenced >
  private registration: ServiceWorkerRegistration | null = null;
  private isRegistering = false;

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(
    swUrl: string,
    options: ServiceWorkerRegistrationOptions = {}
  ): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    if (this.registration || this.isRegistering) {
      console.log('Service Worker already registered or registering');
      return this.registration;
    }

    this.isRegistering = true;

    try {
      // First, unregister any old service workers
      await this.unregisterOldServiceWorkers();

      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: options.scope,
        updateViaCache: options.updateViaCache,
      });

      this.registration = registration;

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              options.onUpdate?.(registration);
            }
          });
        }
      });

      // Check if this is the first registration
      if (!navigator.serviceWorker.controller) {
        options.onSuccess?.(registration);
      }

      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      options.onError?.(error as Error);
      return null;
    } finally {
      this.isRegistering = false;
    }
  }

  async unregisterOldServiceWorkers(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
      console.log('Unregistered old service workers');
    } catch (error) {
      console.error('Error unregistering old service workers:', error);
    }
  }

  async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null;

    if (this.registration) return this.registration;

    const registration = await navigator.serviceWorker.getRegistration();
    return registration || null;
  }

  async update(): Promise<ServiceWorkerRegistration | null> {
    if (!this.registration) return null;

    try {
      await this.registration.update();
      return this.registration;
    } catch (error) {
      console.error('Service Worker update failed:', error);
      return null;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const result = await this.registration.unregister();
      if (result) {
        this.registration = null;
        console.log('Service Worker unregistered');
      }
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }
}

export const serviceWorkerManager = ServiceWorkerManager.getInstance();

export const registerServiceWorker =
  serviceWorkerManager.register.bind(serviceWorkerManager);
export const getServiceWorkerRegistration =
  serviceWorkerManager.getRegistration.bind(serviceWorkerManager);
export const updateServiceWorker =
  serviceWorkerManager.update.bind(serviceWorkerManager);
export const unregisterServiceWorker =
  serviceWorkerManager.unregister.bind(serviceWorkerManager);
export const isServiceWorkerSupported =
  serviceWorkerManager.isSupported.bind(serviceWorkerManager);
