import { Link } from "react-router-dom";

export default function SettingsPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-gray-500">
        Manage your QSaver account preferences.
      </p>

      <div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        <div className="p-5">
          <h2 className="font-semibold">Account profile</h2>
          <p className="mt-2 text-sm text-gray-500">
            View the name and email associated with your account.
          </p>
          <Link to="/app/profile" className="mt-3 inline-block text-sm font-medium text-indigo-600">
            Open profile →
          </Link>
        </div>

        <div className="p-5">
          <h2 className="font-semibold">Data synchronization</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            The web app and Chrome extension use the same Firebase project.
            Your problems are stored in your own user collection.
          </p>
        </div>
      </div>
    </section>
  );
}