import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { logOut } from "../../features/auth/authService";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setLoading(true);
    setError("");

    try {
      await logOut();
      navigate("/login", { replace: true });
    } catch {
      setError("Couldn't sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Your profile</h1>
      <p className="mt-2 text-gray-500">Your QSaver account information.</p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="border-b border-gray-100 pb-5">
          <p className="text-sm text-gray-500">Name</p>
          <p className="mt-1 font-semibold">{user?.displayName || "Not set"}</p>
        </div>

        <div className="border-b border-gray-100 py-5">
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-1 font-semibold">{user?.email || "Not available"}</p>
        </div>

        <div className="py-5">
          <p className="text-sm text-gray-500">Email verification</p>
          <p className="mt-1 font-semibold">
            {user?.emailVerified ? "Verified" : "Not verified"}
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={loading}
          className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </section>
  );
}