import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/book-leisure")({
  component: BookLeisure,
  head: () => ({
    meta: [
      { title: "Book Leisure — HotelGroupBook" },
      { name: "description", content: "Request group hotel offers for leisure travel." },
    ],
  }),
});

function BookLeisure() {
  return (
    <main className="min-h-screen bg-[#04111A] text-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h1
          className="text-4xl lg:text-5xl font-medium"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Book Leisure
        </h1>
        <p className="mt-4 text-[#C8CFD6]">
          Coming soon.
        </p>
      </div>
    </main>
  );
}
