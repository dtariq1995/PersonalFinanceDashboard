import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal(false);

  constructor() {
    const stored = localStorage.getItem('darkMode');
    const initial = stored !== null
      ? stored === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.darkMode.set(initial);
    document.documentElement.classList.toggle('dark', initial);

    effect(() => {
      const dark = this.darkMode();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('darkMode', String(dark));
    });
  }

  toggle(): void {
    this.darkMode.update(v => !v);
  }
}
