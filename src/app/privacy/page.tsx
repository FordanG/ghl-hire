import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="fade-in fade-in-1">
          <h1 className="text-4xl font-semibold tracking-tight mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At GHL Hire, we collect information you provide directly to us, such as when you create an account, post a job, apply for positions, or contact us for support.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Account information (name, email, password)</li>
              <li>Profile information (skills, experience, resume)</li>
              <li>Job posting details and company information</li>
              <li>Communication preferences and history</li>
            </ul>
          </section>

          <section className="fade-in fade-in-3">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect to provide, maintain, and improve our services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Matching job seekers with relevant opportunities</li>
              <li>Facilitating communication between employers and candidates</li>
              <li>Sending relevant job alerts and platform updates</li>
              <li>Improving our AI-powered matching algorithms</li>
            </ul>
          </section>

          <section className="fade-in fade-in-4">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>With employers when you apply for jobs (with your consent)</li>
              <li>With service providers who help us operate our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transaction (merger, sale, etc.)</li>
            </ul>
          </section>

          <section className="fade-in fade-in-5">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="fade-in fade-in-6">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="fade-in fade-in-1">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@ghlhire.com or through our contact page.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}