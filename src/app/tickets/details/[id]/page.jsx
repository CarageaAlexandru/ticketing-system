import { TicketComments } from "@/components/TicketComments";
import TicketDetails from "@/components/TicketDetails";

export default function TicketDetailsPage({ params }) {
  return (
    <article>
      <TicketDetails params={params} />
      <TicketComments />
    </article>
  );
}
