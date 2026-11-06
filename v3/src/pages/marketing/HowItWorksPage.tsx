export default function HowItWorksPage() {
  const steps = [
    "Save a coding problem using QSaver.",
    "Record your approach, notes, and complexity.",
    "Revisit and search your saved solutions when preparing for interviews.",
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">How QSaver works</h1>

      <ol className="mt-8 space-y-5">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-4 rounded-xl border border-gray-200 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
              {index + 1}
            </span>
            <p className="pt-1 text-gray-700">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}