import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About • Pharmacy Connect</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold text-green-600">💊 Pharmacy Connect</h1>
          <div className="space-x-6 text-gray-700 font-medium">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <Link href="/contact" className="hover:text-green-600">Contact</Link>
            <Link href="/login" className="hover:text-green-600">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Sign Up</Link>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src="/Pharmacare Overview Illustration.png"
              alt="Healthcare"
              className="w-full rounded-xl shadow-lg object-cover"
            />
            <div>
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">About Pharmacy Connect</h2>
              <p className="text-gray-700 mb-4">
                We’re building a bridge between pharmacies and patients with smart features like digital prescription storage, medicine availability checks, refill reminders, and chat with pharmacists.
              </p>
              <p className="text-gray-700">
                Our goal is to simplify chronic care management in India — diabetes, blood pressure, thyroid — and ensure timely access to medicines.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
