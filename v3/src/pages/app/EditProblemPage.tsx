
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

import { useAuth } from "../../features/auth/AuthProvider";
import {
  getProblemById,
  updateProblem,
} from "../../features/problems/problemRepository";
import type {
  Problem,
  ProblemMethod,
} from "../../features/problems/problemTypes";

type EditableMethod = ProblemMethod & {
  name?: string;
};

function normalizeMethods(methods: unknown): EditableMethod[] {
  if (!Array.isArray(methods)) return [];

  return methods.map((item) => {
    const method = item as Record<string, unknown>;

    return {
      methodName: String(method.methodName ?? method.name ?? ""),
      timeComplexity: String(method.timeComplexity ?? ""),
      spaceComplexity: String(method.spaceComplexity ?? ""),
      shortNote: String(method.shortNote ?? ""),
      code: String(method.code ?? ""),
    };
  });
}

export default function EditProblemPage() {
  const location = useLocation();
  const problemId = location.state?.problemId as string | undefined;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemName, setProblemName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tagsText, setTagsText] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [shortNote, setShortNote] = useState("");
  const [methods, setMethods] = useState<EditableMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user || !problemId) {
        setError("Problem not found. Open Edit from the problem library.");
        setLoading(false);
        return;
      }

      try {
        const result = await getProblemById(user.uid, problemId);

        if (!active) return;

        if (!result) {
          setError("This problem could not be found.");
          return;
        }

        setProblem(result);
        setProblemName(result.problemName ?? "");
        setDifficulty(result.difficulty ?? "Easy");
        setTagsText((result.tags ?? []).join(", "));
        setTimeTaken(
          result.timeTaken == null ? "" : String(result.timeTaken),
        );
        setShortNote(result.shortNote ?? "");
        setMethods(normalizeMethods(result.methods));
      } catch (loadError) {
        console.error("Failed to load problem for editing:", loadError);

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Couldn't load this problem.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [user, problemId]);

  function updateMethod(
    index: number,
    field: keyof ProblemMethod,
    value: string,
  ) {
    setMethods((current) =>
      current.map((method, i) =>
        i === index ? { ...method, [field]: value } : method,
      ),
    );
  }

  function addMethod() {
    if (methods.length >= 5) return;

    setMethods((current) => [
      ...current,
      {
        methodName: "",
        timeComplexity: "",
        spaceComplexity: "",
        shortNote: "",
        code: "",
      },
    ]);
  }

  function removeMethod(index: number) {
    setMethods((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !problemId || !problem) return;

    setError("");

    if (!problemName.trim()) {
      setError("Problem name is required.");
      return;
    }

    if (methods.some((method) => !method.methodName?.trim())) {
      setError("Please provide a name for every solution method.");
      return;
    }

    const parsedTime = timeTaken.trim() ? Number(timeTaken) : undefined;

    if (
      parsedTime !== undefined &&
      (!Number.isFinite(parsedTime) || parsedTime < 0)
    ) {
      setError("Time taken must be a non-negative number.");
      return;
    }

    setSaving(true);

    try {
      const methodsToSave: ProblemMethod[] = methods.map((method) => ({
        methodName: method.methodName.trim(),
        timeComplexity: method.timeComplexity ?? "",
        spaceComplexity: method.spaceComplexity ?? "",
        shortNote: method.shortNote ?? "",
        code: method.code ?? "",
      }));

      await updateProblem(user.uid, problemId, {
        problemName: problemName.trim(),
        difficulty,
        tags: tagsText
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        timeTaken: parsedTime,
        shortNote,
        methods: methodsToSave,
      });

      navigate(`/app/problems/${encodeURIComponent(problemId)}`, {
        replace: true,
      });
    } catch (saveError) {
      console.error("Failed to update problem:", saveError);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p role="status" className="p-6">Loading problem...</p>;
  }

  if (!problem) {
    return (
      <section className="p-6">
        <p role="alert" className="mb-3 text-red-700">
          {error || "Problem not found."}
        </p>
        <Link to="/app/problems" className="text-indigo-600 hover:underline">
          Back to problems
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl pb-10">
      <Link
        to="/app/problems"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Back to problems
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit problem</h1>
      <p className="mt-2 text-sm text-gray-500">
        Update your problem details, notes, and solution code.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div>
          <label htmlFor="problem-name" className="mb-2 block text-sm font-medium">
            Problem name
          </label>
          <input
            id="problem-name"
            required
            value={problemName}
            onChange={(event) => setProblemName(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="mb-2 block text-sm font-medium">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-indigo-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="mb-2 block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="Array, Hash Table, Two Pointers"
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate tags with commas.
          </p>
        </div>

        <div>
          <label htmlFor="time-taken" className="mb-2 block text-sm font-medium">
            Time taken (minutes)
          </label>
          <input
            id="time-taken"
            type="number"
            min="0"
            step="any"
            value={timeTaken}
            onChange={(event) => setTimeTaken(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="short-note" className="mb-2 block text-sm font-medium">
            Problem notes
          </label>
          <textarea
            id="short-note"
            rows={4}
            value={shortNote}
            onChange={(event) => setShortNote(event.target.value)}
            placeholder="What did you learn? What should you remember?"
            className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Solution methods</h2>
              <p className="mt-1 text-sm text-gray-500">
                Add up to five approaches, each with its own code editor.
              </p>
            </div>

            <button
              type="button"
              onClick={addMethod}
              disabled={methods.length >= 5}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add method
            </button>
          </div>

          {methods.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm text-gray-500">
                No solution methods yet. Add one to record your approach and code.
              </p>
            </div>
          )}

          {methods.map((method, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="font-semibold">Method {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeMethod(index)}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <label
                    htmlFor={`method-name-${index}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    Method name
                  </label>
                  <input
                    id={`method-name-${index}`}
                    required
                    value={method.methodName ?? ""}
                    onChange={(event) =>
                      updateMethod(index, "methodName", event.target.value)
                    }
                    placeholder="e.g. Sorting approach"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`time-complexity-${index}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      Time complexity
                    </label>
                    <input
                      id={`time-complexity-${index}`}
                      value={method.timeComplexity ?? ""}
                      onChange={(event) =>
                        updateMethod(index, "timeComplexity", event.target.value)
                      }
                      placeholder="O(n log n)"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`space-complexity-${index}`}
                      className="mb-2 block text-sm font-medium"
                    >
                      Space complexity
                    </label>
                    <input
                      id={`space-complexity-${index}`}
                      value={method.spaceComplexity ?? ""}
                      onChange={(event) =>
                        updateMethod(index, "spaceComplexity", event.target.value)
                      }
                      placeholder="O(1)"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`method-note-${index}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    Method notes
                  </label>
                  <textarea
                    id={`method-note-${index}`}
                    rows={3}
                    value={method.shortNote ?? ""}
                    onChange={(event) =>
                      updateMethod(index, "shortNote", event.target.value)
                    }
                    placeholder="Explain this approach and what you learned..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between bg-[#252526] px-4 py-2 text-sm text-gray-200">
                    <span>Solution code</span>
                    <span className="text-xs text-gray-400">VS Code style</span>
                  </div>

                  <Editor
                    height="350px"
                    language="cpp"
                    theme="vs-dark"
                    value={method.code ?? ""}
                    onChange={(value) =>
                      updateMethod(index, "code", value ?? "")
                    }
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      wordWrap: "on",
                      padding: { top: 12, bottom: 12 },
                      renderLineHighlight: "line",
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          <Link
            to={`/app/problems/${encodeURIComponent(problem.id)}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
