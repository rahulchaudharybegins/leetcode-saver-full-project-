import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { getProblemById } from "../../features/problems/problemRepository";
import {
  formatVisitedDate,
  getProblemTitle,
} from "../../features/problems/problemService";
import type { Problem } from "../../features/problems/problemTypes";

export default function ProblemDetailPage() {
  const { problemId } = useParams();
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProblem() {
      if (!user || !problemId) {
        setError("Problem not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getProblemById(user.uid, problemId);

        if (active) {
          setProblem(result);
          if (!result) setError("This problem could not be found.");
        }
      } catch {
        if (active) setError("Couldn't load this problem. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProblem();

    return () => {
      active = false;
    };
  }, [user, problemId]);

  if (loading) {
    return <p role="status" className="py-10 text-gray-500">Loading problem...</p>;
  }

  if (error || !problem) {
    return (
      <section>
        <p role="alert" className="text-red-600">
          {error || "Problem not found."}
        </p>
        <Link to="/app/problems" className="mt-4 inline-block text-indigo-600">
          ← Back to problems
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <Link to="/app/problems" className="text-sm font-medium text-indigo-600">
        ← Back to problems
      </Link>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{problem.platform}</p>
            <h1 className="mt-2 text-3xl font-bold">
              {getProblemTitle(problem)}
            </h1>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {problem.difficulty || "Unknown"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Visit count</p>
            <p className="mt-1 text-xl font-semibold">
              {problem.visitCount ?? 0}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Last visited</p>
            <p className="mt-1 font-semibold">
              {formatVisitedDate(problem.lastVisitedAt)}
            </p>
          </div>
        </div>

        {problem.tags && problem.tags.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {problem.shortNote && (
          <div className="mt-6">
            <h2 className="font-semibold">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-600">
              {problem.shortNote}
            </p>
          </div>
        )}

        {problem.methods && problem.methods.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Solution approaches</h2>
            <div className="mt-4 space-y-4">
              {problem.methods.map((method, index) => (
                <article key={`${method.methodName}-${index}`} className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold">
                    {method.methodName || `Method ${index + 1}`}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Time complexity: {method.timeComplexity || "Not recorded"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Space complexity: {method.spaceComplexity || "Not recorded"}
                  </p>
                  {method.shortNote && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {method.shortNote}
                    </p>
                  )}
                  {method.code && (
                    <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
                      <code>{method.code}</code>
                    </pre>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {problem.problemUrl && (
          <a
            href={problem.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
          >
            Open original problem ↗ <Link
                                     to={`/app/problems/${encodeURIComponent(problem.id)}/edit`}
                                     className="inline-flex rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
                                     >
                                     Edit problem
                                    </Link>
          </a>
        )}
      </div>
    </section>
  );
}