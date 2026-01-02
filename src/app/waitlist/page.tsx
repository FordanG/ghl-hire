"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, User, CheckCircle, Loader2 } from "lucide-react";

type UserType = "employer" | "jobseeker" | null;

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      setError("Please select whether you're an employer or job seeker");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 waitlist-bg">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re on the list!</h1>
          <p className="text-gray-600 mb-6">
            Thanks for joining the GHL Hire waitlist. We&apos;ll notify you as soon as we launch.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 waitlist-bg">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/waitlist" className="inline-block mb-6">
            <span className="text-3xl font-bold">
              <span className="text-gray-900">GHL</span>
              <span className="text-blue-600">Hire</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Join the Waitlist
          </h1>
          <p className="text-gray-600">
            Be the first to know when GHL Hire launches. The premier job board for GoHighLevel professionals.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUserType("jobseeker");
                    setError("");
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    userType === "jobseeker"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className={`w-6 h-6 ${userType === "jobseeker" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="font-medium">Job Seeker</span>
                  <span className="text-xs text-center opacity-75">Looking for GHL opportunities</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserType("employer");
                    setError("");
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    userType === "employer"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Briefcase className={`w-6 h-6 ${userType === "employer" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="font-medium">Employer</span>
                  <span className="text-xs text-center opacity-75">Hiring GHL talent</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            We&apos;ll only email you about the launch. No spam, ever.
          </p>
        </div>

      </div>
    </div>
  );
}
