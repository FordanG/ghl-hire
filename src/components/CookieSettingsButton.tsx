'use client';

export default function CookieSettingsButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).showCookieSettings) {
      (window as any).showCookieSettings();
    }
  };

  return (
    <button
      className="text-blue-600 hover:underline"
      onClick={handleClick}
    >
      Cookie Settings
    </button>
  );
}
