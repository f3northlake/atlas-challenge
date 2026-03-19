'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Render a stable placeholder until client has mounted to avoid hydration mismatch
  if (!mounted) return <span className="w-5 inline-block" />;

  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setDark(isDark);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-white hover:text-f3yellow transition-colors text-base leading-none"
    >
      {dark ? '☀' : '☾'}
    </button>
  );
}
