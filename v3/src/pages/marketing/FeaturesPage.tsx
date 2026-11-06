export default function FeaturesPage() {
  const features = [
    ["Problem library", "Keep your saved coding problems organized."],
    ["Multiple approaches", "Record different methods for solving a problem."],
    ["Complexity notes", "Document time and space complexity."],
    ["Tags and notes", "Make revision easier with searchable notes and topics."],
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold">QSaver features</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {features.map(([title, description]) => (
          <article key={title} className="rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}