import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - GHL Hire',
  description: 'GHL Hire Terms of Service. Read our terms and conditions for using the GoHighLevel job board platform.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ghlhire.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="fade-in fade-in-1">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: November 9, 2025</p>
          <p className="text-gray-600 mb-8">
            Please read these Terms of Service carefully before using GHL Hire. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using GHL Hire (&quot;Service&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We reserve the right to update and change these Terms of Service by posting updates and changes to the Platform. You are advised to check the Terms of Service from time to time for any updates or changes.
            </p>
          </section>

          <section className="fade-in fade-in-3">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GHL Hire is a specialized job board platform connecting GoHighLevel professionals with employment opportunities. The Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Job listing and search functionality</li>
              <li>Profile creation for job seekers and employers</li>
              <li>Application management system</li>
              <li>AI-powered job matching and recommendations</li>
              <li>Communication tools between employers and candidates</li>
              <li>Analytics and reporting features for employers</li>
            </ul>
          </section>

          <section className="fade-in fade-in-4">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-3 mt-4">3.1 Account Creation</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Account Responsibilities</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Safeguarding your password and maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use or security breach</li>
              <li>Ensuring your profile information is accurate and up-to-date</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.3 Account Types</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Job Seeker Accounts</strong>: For individuals seeking employment opportunities</li>
              <li><strong>Employer Accounts</strong>: For companies posting job opportunities</li>
            </ul>
          </section>

          <section className="fade-in fade-in-5">
            <h2 className="text-2xl font-semibold mb-4">4. Job Postings and Applications</h2>
            <h3 className="text-xl font-semibold mb-3 mt-4">4.1 Employer Responsibilities</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Employers posting jobs on GHL Hire agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide accurate, complete, and honest job descriptions</li>
              <li>Comply with all applicable employment laws and regulations</li>
              <li>Not discriminate based on race, religion, gender, age, disability, or any other protected characteristic</li>
              <li>Honor posted compensation ranges and benefits</li>
              <li>Respect candidate privacy and handle application data responsibly</li>
              <li>Not use the Platform for recruiting for unlawful purposes</li>
              <li>Pay applicable subscription fees in a timely manner</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.2 Job Seeker Responsibilities</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Job seekers agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide truthful and accurate information in profiles and applications</li>
              <li>Not misrepresent qualifications, experience, or credentials</li>
              <li>Not apply for positions using false identities</li>
              <li>Respect employer proprietary information shared during application process</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.3 Content Moderation</h3>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to review, moderate, and remove any job posting or profile content that violates these Terms or is otherwise objectionable. We may also suspend or terminate accounts that repeatedly violate our content policies.
            </p>
          </section>

          <section className="fade-in fade-in-6">
            <h2 className="text-2xl font-semibold mb-4">5. Subscription Plans and Payments</h2>
            <h3 className="text-xl font-semibold mb-3 mt-4">5.1 Subscription Tiers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Employer accounts have access to different subscription tiers with varying features and limitations. Current plans and pricing are available on our <Link href="/pricing" className="text-blue-600 hover:underline">pricing page</Link>.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">5.2 Payment Terms</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Subscriptions are billed monthly in advance</li>
              <li>All fees are in Philippine Pesos (PHP) unless otherwise stated</li>
              <li>Payment is processed via Maya (PayMaya)</li>
              <li>Failure to pay may result in suspension of premium features</li>
              <li>Refunds are provided at our discretion and according to our refund policy</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">5.3 Subscription Changes</h3>
            <p className="text-gray-600 leading-relaxed">
              You may upgrade or downgrade your subscription at any time. Changes take effect at the start of the next billing cycle. We reserve the right to modify subscription prices with 30 days advance notice.
            </p>
          </section>

          <section className="fade-in fade-in-1">
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may not use our Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track personal information of others without consent</li>
              <li>To spam, phish, or engage in other unsolicited communications</li>
              <li>To interfere with or circumvent security features of the Service</li>
              <li>To engage in automated data collection (scraping) without permission</li>
            </ul>
          </section>

          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by GHL Hire and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use any content you post on the Platform in connection with operating and improving the Service.
            </p>
          </section>

          <section className="fade-in fade-in-3">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you wish to terminate your account, you may simply discontinue using the Service or request deletion through your account settings.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section className="fade-in fade-in-4">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In no event shall GHL Hire, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="fade-in fade-in-5">
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied.
            </p>
            <p className="text-gray-600 leading-relaxed">
              GHL Hire does not warrant that (a) the Service will function uninterrupted, secure, or available at any particular time or location; (b) any errors or defects will be corrected; (c) the Service is free of viruses or other harmful components; or (d) the results of using the Service will meet your requirements.
            </p>
          </section>

          <section className="fade-in fade-in-6">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of the Philippines.
            </p>
          </section>

          <section className="fade-in fade-in-1">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of significant changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-none space-y-2 text-gray-600">
              <li>Email: <a href="mailto:legal@ghlhire.com" className="text-blue-600 hover:underline">legal@ghlhire.com</a></li>
              <li>Contact Page: <Link href="/contact" className="text-blue-600 hover:underline">ghlhire.com/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
