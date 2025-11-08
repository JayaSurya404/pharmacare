import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Pharmacy Connect</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-50">
          <h1 className="text-2xl font-bold text-green-600">💊 Pharmacy Connect</h1>
          <div className="space-x-6 text-gray-700 font-medium">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <Link href="/about" className="hover:text-green-600">About</Link>
            <Link href="/contact" className="hover:text-green-600">Contact</Link>
            <Link href="/login" className="hover:text-green-600">Login</Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
              Your <span className="text-green-600">Pharmacy</span> at Your Fingertips
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Manage prescriptions, streamline operations, and connect customers with pharmacies in one smart platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/signup"
                className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-green-600 text-green-600 rounded-xl shadow-md hover:bg-green-600 hover:text-white transition"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <Image
              src="/pharmacy1.jpg"
              alt="Pharmacy illustration"
              width={600}
              height={400}
              className="w-full max-w-xl rounded-xl shadow-lg object-cover"
            />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-12">
              Why Choose <span className="text-green-600">Pharmacy Connect?</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl shadow-lg bg-green-50">
                <div className="text-green-600 text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-semibold mb-2">Fast Access</h4>
                <p className="text-gray-600">Quickly access prescriptions and records anytime.</p>
              </div>
              <div className="p-6 rounded-xl shadow-lg bg-green-50">
                <div className="text-green-600 text-4xl mb-4">🔒</div>
                <h4 className="text-xl font-semibold mb-2">Secure</h4>
                <p className="text-gray-600">Your data is safe with robust authentication and encryption.</p>
              </div>
              <div className="p-6 rounded-xl shadow-lg bg-green-50">
                <div className="text-green-600 text-4xl mb-4">🌍</div>
                <h4 className="text-xl font-semibold mb-2">Accessible Anywhere</h4>
                <p className="text-gray-600">Manage your pharmacy from any device, anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Teaser */}
        <section className="py-20 bg-green-50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/about us1.png"
                alt="About Pharmacy"
                width={600}
                height={400}
                className="w-full rounded-xl shadow-lg object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">About Us</h3>
              <p className="text-gray-600 mb-4">
                Pharmacy Connect empowers pharmacies and customers with digital tools for prescriptions, refills, reminders, and communication.
              </p>
              <p className="text-gray-600 mb-6">
                Built for India’s needs—reduce stock-out issues, keep prescriptions safely stored, and never miss a refill.
              </p>
              <Link
                href="/about"
                className="inline-block px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-12">What People Say</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-green-50 shadow-md rounded-xl p-6">
                <p className="text-gray-600 italic">
                  "Managing my pharmacy has never been easier!"
                </p>
                <h4 className="mt-4 font-semibold text-green-600">— Pharmacy Owner</h4>
              </div>
              <div className="bg-green-50 shadow-md rounded-xl p-6">
                <p className="text-gray-600 italic">
                  "I can order medicines from home. Super convenient!"
                </p>
                <h4 className="mt-4 font-semibold text-green-600">— Customer</h4>
              </div>
              <div className="bg-green-50 shadow-md rounded-xl p-6">
                <p className="text-gray-600 italic">
                  "Simple, clean, and powerful platform for our team."
                </p>
                <h4 className="mt-4 font-semibold text-green-600">— Pharmacist</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-green-600 text-white text-center">
          <h3 className="text-3xl font-bold mb-3">Have questions?</h3>
          <p className="mb-6 opacity-90">We’re here to help you get started.</p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-green-600 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-white py-6 text-center text-sm text-gray-500 shadow-inner">
          © {new Date().getFullYear()} Pharmacy Connect. All rights reserved.
        </footer>
      </div>
    </>
  );
}
