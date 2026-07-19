import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/book-leisure/request")({
  component: RequestPage,
  head: () => ({
    meta: [
      { title: "Start Your Request — Book Leisure | HotelGroupBook" },
      { name: "description", content: "Start your group leisure booking request." },
    ],
  }),
});

function RequestPage() {
  return (
    <main
      className="relative min-h-screen w-full px-6 py-24 text-white"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h1
          className="text-5xl font-medium"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Start Your Request
        </h1>
        <p className="mt-4 text-[#B8B8B8]">
          Your premium booking form is coming next.
        </p>
        <Link
          to="/book-leisure"
          className="mt-10 inline-block text-xs uppercase tracking-[0.3em] text-[#C9A24A] hover:text-[#F5AE00]"
        >
          ← Back
        </Link>
      </div>
    </main>
  );
}
