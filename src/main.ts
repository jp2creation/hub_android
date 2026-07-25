import './styles.css';

import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import { StatusBar, Style } from '@capacitor/status-bar';

const openingAnimationUrl = new URL('./assets/opening-animation.gif', import.meta.url).href;
const openingAnimationDurationMs = 5500;
const defaultHubUrl = 'about:blank';
const hubUrl = normalizeHubUrl(import.meta.env.VITE_HUB_URL || import.meta.env.VITE_API_BASE_URL || defaultHubUrl);
const appRoot = document.querySelector<HTMLDivElement>('#app');

if (!appRoot) {
  throw new Error('App root missing');
}

const app: HTMLDivElement = appRoot;

void boot();

async function boot(): Promise<void> {
  const startupIntro = renderStartup();

  await setupNativeRuntime();
  await startupIntro;
  openCrmWebView();
}

async function setupNativeRuntime(): Promise<void> {
  if (!isNativeApp()) {
    return;
  }

  void StatusBar.setStyle({ style: Style.Dark }).catch(() => undefined);
  void StatusBar.setBackgroundColor({ color: '#95002e' }).catch(() => undefined);
  void Keyboard.setResizeMode({ mode: KeyboardResize.Body }).catch(() => undefined);
  void Keyboard.setStyle({ style: KeyboardStyle.Light }).catch(() => undefined);

  void CapacitorApp.addListener('backButton', () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    void CapacitorApp.minimizeApp().catch(() => CapacitorApp.exitApp());
  }).catch(() => undefined);
}

function renderStartup(): Promise<void> {
  app.innerHTML = `
    <main class="startup-screen" data-startup-screen aria-label="Ouverture JP2 Création">
      <img
        class="startup-intro-media"
        src="${escapeHtml(openingAnimationUrl)}"
        alt=""
        decoding="async"
      >
    </main>
  `;

  return new Promise((resolve) => {
    const screen = app.querySelector<HTMLElement>('[data-startup-screen]');
    const introImage = app.querySelector<HTMLImageElement>('.startup-intro-media');
    let finished = false;

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      screen?.classList.add('is-finishing');
      window.setTimeout(resolve, 320);
    };

    const animationTimer = window.setTimeout(finish, openingAnimationDurationMs);
    const fallback = window.setTimeout(finish, openingAnimationDurationMs + 900);

    const complete = () => {
      window.clearTimeout(animationTimer);
      window.clearTimeout(fallback);
      finish();
    };

    if (!introImage) {
      complete();
      return;
    }

    introImage.addEventListener('error', complete, { once: true });
  });
}

function openCrmWebView(): void {
  document.documentElement.classList.add('crm-native-handoff');
  app.innerHTML = '';
  window.location.replace(hubUrl);
}

function normalizeHubUrl(value: string): string {
  let trimmed = value.trim();

  if (!trimmed) {
    return defaultHubUrl;
  }

  if (trimmed === 'about:blank') {
    return trimmed;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const url = new URL(trimmed);

    if (!url.searchParams.has('mobile_app')) {
      url.searchParams.set('mobile_app', '1');
    }

    return url.href;
  } catch {
    return defaultHubUrl;
  }
}

function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return entities[char] || char;
  });
}
