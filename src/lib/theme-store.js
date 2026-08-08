"use client";

const listeners = new Set();

export function subscribeTheme(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function getThemeServerSnapshot() {
  return false;
}

export function setTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("pulse-theme", isDark ? "dark" : "light");
  listeners.forEach((cb) => cb());
}
