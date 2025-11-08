import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for reaching out! We’ll get back to you soon.");
    setName("");
    setMsg("");
  };

  return (
    <>
      <Head>
        <title>Contact • Pharmacy Connect</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold text-green-600">💊 Pharmacy Connect</h1>
          <div className="space-x-6 text-gray-700 font-medium">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <Link href="/about" className="hover:text-green-600">About</Link>
            <Link href="/login" className="hover:text-green-600">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Sign Up</Link>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Contact Us</h2>
          <p className="text-gray-600 text-center mb-10">
            Have questions or feedback? We’d love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
            />
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Send Message
            </button>
          </form>

          <div className="text-center mt-8 text-gray-600">
            Or email us at{" "}
            <a href="mailto:support@pharmacyconnect.com" className="text-green-700 font-medium">
              support@pharmacyconnect.com
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
