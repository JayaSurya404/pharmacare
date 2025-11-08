import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed ❌");
      } else {
        // ✅ Save user info
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userType", data.user.userType);

        // ✅ Save pharmacy email specifically for inventory
        if (data.user.userType === "pharmacy") {
          localStorage.setItem("pharmacyEmail", data.user.email);
        }

        alert("Login successful 🎉");

        // ✅ Redirect based on role
        if (data.user.userType === "customer") {
          router.push("/customer-dashboard");
        } else if (data.user.userType === "pharmacy") {
          router.push("/pharmacy-dashboard");
        } else {
          alert("Unknown role ❌");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 text-white p-3 rounded-full shadow-md">
              <i className="fas fa-pills text-2xl"></i>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Login
          </h1>
          <p className="text-sm text-center text-gray-500 mb-6">
            Welcome back! Please log in 👋
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
              placeholder="Email Address"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
              placeholder="Password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
