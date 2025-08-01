import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="fade-in fade-in-1">
          <h1 className="text-4xl font-semibold tracking-tight mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using GHL Hire, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="fade-in fade-in-3">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Permission is granted to temporarily access GHL Hire for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="fade-in fade-in-4">
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Safeguarding the password and all activities under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your profile information is accurate and up-to-date</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="fade-in fade-in-5">
            <h2 className="text-2xl font-semibold mb-4">Job Postings and Applications</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Employers posting jobs on GHL Hire agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide accurate and complete job descriptions</li>
              <li>Comply with all employment laws and regulations</li>
              <li>Not discriminate based on protected characteristics</li>
              <li>Respect candidate privacy and data</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Job seekers agree to provide truthful information in their profiles and applications.
            </p>
          </section>

          <section className="fade-in fade-in-6">
            <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          <section className="fade-in fade-in-1">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed">
              The materials on GHL Hire are provided on an &apos;as is&apos; basis. GHL Hire makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="fade-in fade-in-2">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at legal@ghlhire.com.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}