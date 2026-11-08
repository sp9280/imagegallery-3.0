/**
 * Theme configuration for ImageGallery
 * Supports light and dark themes
 */

export const themes = {
  light: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    hover: '#f1f5f9',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    border: '#334155',
    hover: '#334155',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.light;
  const root = document.documentElement;

  Object.keys(theme).forEach(key => {
    root.style.setProperty(`--color-${key}`, theme[key]);
  });

  // Apply class for Tailwind dark mode and CSS-based theming
  if (themeName === 'dark') {
    root.classList.add('dark');
    document.body.classList.add('dark-theme');
  } else {
    root.classList.remove('dark');
    document.body.classList.remove('dark-theme');
  }
};

export const getCurrentTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
  return newTheme;
};

// Initialize theme on load
export const initTheme = () => {
  const savedTheme = getCurrentTheme();
  applyTheme(savedTheme);
};
