import TicketList from "@/components/TicketList";

export default async function TicketsPage({ searchParams }) {
  const dummyTickets = [
    {
      id: 1,
      title: "Write Supabase Book",
      status: "Not started",
      author: "Chayan",
    },
    {
      id: 2,
      title: "Read more Packt Books",
      status: "In progress",
      author: "David",
    },
    {
      id: 3,
      title: "Make videos for the YouTube Channel",
      status: "Done",
      author: "David",
    },
  ];

  return (
    <div className="px-4 py-5 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tickets</h1>
      <TicketList tickets={dummyTickets} />
    </div>
  );
}
