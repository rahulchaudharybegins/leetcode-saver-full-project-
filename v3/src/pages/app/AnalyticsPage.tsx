import { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { getProblems } from "../../features/problems/problemRepository";
import type { Problem } from "../../features/problems/problemTypes";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProblems(user.uid);
        if (active) setProblems(data);
      } catch {
        if (active) setError("Couldn't load your analytics.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [user]);

  const easy = problems.filter((p) => p.difficulty?.toLowerCase() === "easy").length;
  const medium = problems.filter((p) => p.difficulty?.toLowerCase() === "medium").length;
  const hard = problems.filter((p) => p.difficulty?.toLowerCase() === "hard").length;
  const totalVisits = problems.reduce((sum, p) => sum + (p.visitCount ?? 0), 0);

  const stats = [
    { label: "Saved problems", value: problems.length },
    { label: "Easy", value: easy },
    { label: "Medium", value: medium },
    { label: "Hard", value: hard },
    { label: "Recorded visits", value: totalVisits },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-2 text-gray-500">
        An overview of your saved coding problems.
      </p>

      {loading && <p role="status" className="mt-8 text-gray-500">Loading analytics...</p>}
      {error && <p role="alert" className="mt-8 text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}