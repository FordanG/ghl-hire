'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, required for functionality
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        applyConsent(saved);
      } catch (e) {
        console.error('Failed to parse cookie consent');
      }
    }

    // Make showCookieSettings available globally
    if (typeof window !== 'undefined') {
      (window as any).showCookieSettings = () => {
        setShowBanner(true);
        setShowSettings(true);
      };
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Apply analytics consent
    if (prefs.analytics) {
      // Enable Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    } else {
      // Disable Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }

    // Apply marketing consent
    if (prefs.marketing) {
      // Enable marketing cookies
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    } else {
      // Disable marketing cookies
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    applyConsent(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showSettings ? (
          // Simple Banner
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Cookie className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-gray-900">Cookie Consent</h2>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Read our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              to learn more about how we handle your data.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
              >
                Accept All
              </button>
              <button
                onClick={handleRejectAll}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
              >
                Reject All
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors min-h-[48px]"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Customize</span>
                <span className="sm:hidden">Settings</span>
              </button>
            </div>
          </div>
        ) : (
          // Detailed Settings
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Cookie Preferences</h2>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Manage your cookie preferences below. Essential cookies cannot be disabled as they are required for the platform to function.
            </p>

            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Always Active</span>
                    <div className="w-12 h-6 bg-blue-600 rounded-full cursor-not-allowed opacity-50">
                      <div className="w-5 h-5 bg-white rounded-full m-0.5 translate-x-6 transition-transform" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle analytics cookies"
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our platform and user experience.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Services: Google Analytics
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle marketing cookies"
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. They may be set by us or by third-party providers.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Services: Currently none (placeholder for future use)
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
