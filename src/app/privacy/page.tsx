import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import CookieSettingsButton from '@/components/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Privacy Policy - GHL Hire',
  description: 'GHL Hire Privacy Policy. Learn how we collect, use, and protect your personal information on our GoHighLevel job board platform.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ghlhire.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="fade-in fade-in-1">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-4">Last updated: November 9, 2025</p>
          <p className="text-gray-600 mb-8">
            At GHL Hire, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our job board platform.
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">1.1 Information You Provide Directly</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information you provide when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Create an Account</strong>: Name, email address, password, phone number</li>
              <li><strong>Build Your Profile</strong>: Skills, work experience, education, resume/CV, portfolio links, professional bio</li>
              <li><strong>Post a Job</strong>: Company name, job details, requirements, compensation information</li>
              <li><strong>Apply for Jobs</strong>: Cover letters, application responses, uploaded documents</li>
              <li><strong>Contact Us</strong>: Support inquiries, feedback, correspondence</li>
              <li><strong>Subscribe</strong>: Payment information (processed securely by Maya/PayMaya)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">1.2 Information Collected Automatically</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you use our Service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Device Information</strong>: IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data</strong>: Pages viewed, time spent, click patterns, search queries, job views</li>
              <li><strong>Location Data</strong>: General location based on IP address (not precise GPS)</li>
              <li><strong>Cookies and Tracking</strong>: Session cookies, preference cookies, analytics cookies (see Cookie Policy below)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">1.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Authentication providers (if you sign in via social login)</li>
              <li>Public professional networks (LinkedIn, if you choose to import)</li>
              <li>Payment processors (transaction confirmations from Maya/PayMaya)</li>
            </ul>
          </section>

          <section className="fade-in fade-in-3">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use collected information for the following purposes:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Core Service Delivery</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Create and manage your account</li>
              <li>Match job seekers with relevant opportunities</li>
              <li>Facilitate communication between employers and candidates</li>
              <li>Process job applications and manage recruitment workflows</li>
              <li>Deliver job alerts and platform notifications</li>
              <li>Process payments and manage subscriptions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Platform Improvement</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Improve our AI-powered job matching algorithms</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analytics</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.3 Communication</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Send transactional emails (application confirmations, status updates)</li>
              <li>Deliver job alerts based on your preferences</li>
              <li>Send platform updates and feature announcements</li>
              <li>Respond to support requests and inquiries</li>
              <li>Send marketing communications (with your consent, opt-out available)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.4 Legal and Security</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Comply with legal obligations and enforce our Terms of Service</li>
              <li>Prevent fraud, abuse, and security incidents</li>
              <li>Protect the rights and safety of our users</li>
              <li>Resolve disputes and troubleshoot issues</li>
            </ul>
          </section>

          <section className="fade-in fade-in-4">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>We do not sell your personal information.</strong> We may share your information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.1 With Your Consent</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Job Applications</strong>: When you apply for a job, your profile and application materials are shared with the employer</li>
              <li><strong>Public Profiles</strong>: Information you choose to make public is visible to other users</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Service Providers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We share information with trusted third-party service providers who assist us in operating our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Supabase</strong>: Database and authentication services</li>
              <li><strong>Maya (PayMaya)</strong>: Payment processing</li>
              <li><strong>Resend</strong>: Email delivery service</li>
              <li><strong>OpenAI</strong>: AI-powered features (job matching, resume analysis)</li>
              <li><strong>Sentry</strong>: Error monitoring and performance tracking</li>
              <li><strong>Vercel</strong>: Hosting and CDN services</li>
              <li><strong>Google Analytics</strong>: Usage analytics (anonymized)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              These providers are contractually obligated to protect your data and use it only for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.3 Legal Requirements</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may disclose your information if required by law or in response to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Legal process (court orders, subpoenas)</li>
              <li>Government requests and regulatory requirements</li>
              <li>Enforcement of our Terms of Service</li>
              <li>Protection of rights, property, and safety of GHL Hire, users, or the public</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.4 Business Transfers</h3>
            <p className="text-gray-600 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you before your information becomes subject to a different privacy policy.
            </p>
          </section>

          <section className="fade-in fade-in-5">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience. You can manage cookie preferences through our <CookieSettingsButton />.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.1 Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Essential Cookies</strong>: Required for platform functionality (authentication, session management)</li>
              <li><strong>Preference Cookies</strong>: Remember your settings and preferences</li>
              <li><strong>Analytics Cookies</strong>: Help us understand how users interact with our platform (Google Analytics)</li>
              <li><strong>Marketing Cookies</strong>: Track effectiveness of our campaigns (optional, requires consent)</li>
            </ul>

            <p className="text-gray-600 leading-relaxed mt-4">
              You can control cookies through your browser settings. Note that disabling essential cookies may affect platform functionality.
            </p>
          </section>

          <section className="fade-in fade-in-6">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Encryption</strong>: Data transmitted using SSL/TLS encryption (HTTPS)</li>
              <li><strong>Access Controls</strong>: Row-level security and authentication for all data access</li>
              <li><strong>Secure Storage</strong>: Data stored in secure, SOC 2 compliant infrastructure (Supabase)</li>
              <li><strong>Payment Security</strong>: Payment information handled by PCI-DSS compliant processors</li>
              <li><strong>Monitoring</strong>: Continuous security monitoring and incident response</li>
              <li><strong>Regular Audits</strong>: Periodic security assessments and updates</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="fade-in fade-in-1">
            <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">6.1 Rights for All Users</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Access</strong>: View and update your personal information in your account settings</li>
              <li><strong>Correction</strong>: Update inaccurate or incomplete information</li>
              <li><strong>Deletion</strong>: Request deletion of your account and associated data</li>
              <li><strong>Opt-Out</strong>: Unsubscribe from marketing emails (transactional emails may still be sent)</li>
              <li><strong>Data Portability</strong>: Download a copy of your data in a machine-readable format</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">6.2 GDPR Rights (EU/EEA Users)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you are located in the European Union or European Economic Area, you have additional rights under GDPR:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Right to be informed about data collection and use</li>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making and profiling</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">6.3 CCPA Rights (California Residents)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information (we do not sell data)</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">6.4 How to Exercise Your Rights</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              To exercise any of these rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Visit your <Link href="/dashboard/settings" className="text-blue-600 hover:underline">Account Settings</Link> for profile updates and data downloads</li>
              <li>Email us at <a href="mailto:privacy@ghlhire.com" className="text-blue-600 hover:underline">privacy@ghlhire.com</a></li>
              <li>Use our <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link></li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We will respond to your request within 30 days. We may need to verify your identity before processing your request.
            </p>
          </section>

          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Active Accounts</strong>: Data retained while your account is active</li>
              <li><strong>Deleted Accounts</strong>: Most data deleted within 30 days of account deletion</li>
              <li><strong>Legal Requirements</strong>: Some data may be retained longer to comply with legal, tax, or regulatory requirements</li>
              <li><strong>Backups</strong>: Data in backups may persist for up to 90 days after deletion</li>
              <li><strong>Job Applications</strong>: Application history may be retained for 2 years for record-keeping purposes</li>
            </ul>
          </section>

          <section className="fade-in fade-in-3">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses for transfers from the EU/EEA.
            </p>
          </section>

          <section className="fade-in fade-in-4">
            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately at <a href="mailto:privacy@ghlhire.com" className="text-blue-600 hover:underline">privacy@ghlhire.com</a>.
            </p>
          </section>

          <section className="fade-in fade-in-5">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically. Your continued use of the Service after changes become effective constitutes acceptance of the revised Privacy Policy.
            </p>
          </section>

          <section className="fade-in fade-in-6">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none space-y-2 text-gray-600">
              <li><strong>Email</strong>: <a href="mailto:privacy@ghlhire.com" className="text-blue-600 hover:underline">privacy@ghlhire.com</a></li>
              <li><strong>Data Protection Officer</strong>: <a href="mailto:dpo@ghlhire.com" className="text-blue-600 hover:underline">dpo@ghlhire.com</a></li>
              <li><strong>Contact Form</strong>: <Link href="/contact" className="text-blue-600 hover:underline">ghlhire.com/contact</Link></li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              For GDPR-related inquiries, you also have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
