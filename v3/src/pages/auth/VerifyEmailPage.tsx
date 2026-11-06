import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { reload } from "firebase/auth";
import { useAuth } from "../../features/auth/AuthProvider";
import { logOut, resendVerificationEmail } from "../../features/auth/authService";

export default function VerifyEmailPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkVerification() {
    if (!user) return;

    setBusy(true);
    setMessage("");
    setError("");

    try {
      await reload(user);

      if (user.emailVerified) {
        setMessage("Email verified successfully. You can open your dashboard.");
      } else {
        setError("Your email is not verified yet. Open the link in your inbox and try again.");
      }
    } catch {
      setError("Couldn't check verification status. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resendEmail() {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      await resendVerificationEmail();
      setMessage("Verification email sent. Check your inbox and spam folder.");
    } catch {
      setError("Couldn't send the email. Please sign in again or try later.");
    } finally {
      setBusy(false);
    }
  }

  async function continueToApp() {
    if (!user) {
      navigate("/login");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await reload(user);

      if (user.emailVerified) {
        navigate("/app", { replace: true });
      } else {
        setError("Verify your email before continuing.");
      }
    } catch {
      setError("Couldn't check verification status. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    try {
      await logOut();
      navigate("/login", { replace: true });
    } catch {
      setError("Couldn't sign out. Please try again.");
    }
  }

  if (authLoading) {
    return <p role="status">Checking your account...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {user?.email
          ? `We need to verify ${user.email} before you continue.`
          : "Sign in with the account you registered to check your verification status."}
      </p>

      {message && (
        <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {user && (
          <>
            <button
              type="button"
              onClick={checkVerification}
              disabled={busy}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              {busy ? "Checking..." : "I've verified my email"}
            </button>

            <button
              type="button"
              onClick={resendEmail}
              disabled={busy}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
            >
              Resend verification email
            </button>

            {user.emailVerified && (
              <button
                type="button"
                onClick={continueToApp}
                disabled={busy}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                Continue to dashboard
              </button>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={busy}
              className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-900"
            >
              Sign out
            </button>
          </>
        )}

        {!user && (
          <Link
            to="/login"
            className="block w-full rounded-lg bg-gray-900 px-4 py-3 text-center font-semibold text-white"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}