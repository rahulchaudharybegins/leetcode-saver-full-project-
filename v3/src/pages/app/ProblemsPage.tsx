import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { getProblems } from "../../features/problems/problemRepository";
import {
  formatVisitedDate,
  getProblemTitle,
} from "../../features/problems/problemService";
import type { Problem } from "../../features/problems/problemTypes";

export default function ProblemsPage() {
  const { user } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProblems() {
      if (!user) {
        setProblems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const results = await getProblems(user.uid);

        if (active) {
          results.sort((a, b) => {
            const dateA = new Date(
              formatVisitedDate(a.lastVisitedAt) === "Not available"
                ? 0
                : String(a.lastVisitedAt),
            ).getTime();

            const dateB = new Date(
              formatVisitedDate(b.lastVisitedAt) === "Not available"
                ? 0
                : String(b.lastVisitedAt),
            ).getTime();

            return dateB - dateA;
          });

          setProblems(results);
        }
      } catch (err) {
        console.error("Failed to load problems:", err);

        if (active) {
          setError("Couldn't load your problems. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProblems();

    return () => {
      active = false;
    };
  }, [user]);

  const filteredProblems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return problems.filter((problem) => {
      const title = getProblemTitle(problem).toLowerCase();

      const matchesSearch =
        !term ||
        title.includes(term) ||
        problem.platform.toLowerCase().includes(term) ||
        (problem.tags ?? []).some((tag) =>
          tag.toLowerCase().includes(term),
        );

      const matchesDifficulty =
        difficulty === "All" ||
        (problem.difficulty ?? "Unknown").toLowerCase() ===
          difficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficulty]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Problem library
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your saved coding problems, all in one place.
          </p>
        </div>

        <span className="text-sm text-gray-500">
          {problems.length} {problems.length === 1 ? "problem" : "problems"}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search problems, platforms, or tags..."
          aria-label="Search problems"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          aria-label="Filter by difficulty"
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {loading && (
        <p role="status" className="py-12 text-center text-gray-500">
          Loading your saved problems...
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {!loading && !error && problems.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold">No saved problems yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Save a problem using your QSaver extension, then return here.
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        problems.length > 0 &&
        filteredProblems.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No problems match your search or selected difficulty.
          </p>
        )}

      {!loading && !error && filteredProblems.length > 0 && (
        <div className="mt-6 space-y-4">
          {filteredProblems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-150 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      <Link
                        to={`/app/problems/${encodeURIComponent(problem.id)}`}
                        className="hover:text-indigo-600"
                      >
                        {getProblemTitle(problem)}
                      </Link>
                    </h2>

                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                      {problem.difficulty || "Unknown"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {problem.platform}
                    {" · "}
                    Last visited: {formatVisitedDate(problem.lastVisitedAt)}
                  </p>

                  {(problem.tags ?? []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(problem.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {problem.problemUrl && (
                    <a
                      href={problem.problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Open ↗
                    </a>
                  )}

                  <Link
                    to="/app/problems/edit"
                    state={{ problemId: problem.id }}
                    className="inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}