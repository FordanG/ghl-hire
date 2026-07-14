'use client';

export default function CookieSettingsButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.showCookieSettings) {
      window.showCookieSettings();
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
