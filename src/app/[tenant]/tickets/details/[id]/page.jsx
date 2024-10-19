import { TicketComments } from "@/components/TicketComments";
import TicketDetails from "@/components/TicketDetails";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { notFound } from "next/navigation";

export default async function TicketDetailsPage({ params }) {
  const supabase = getSupabaseCookiesUtilClient();
  const id = params.id;
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return notFound();

  const supabase_user_id = (await supabase.auth.getUser()).data.user.id;
  const { data: serviceUser } = await supabase
    .from("service_users")
    .select("id")
    .eq("supabase_user", supabase_user_id)
    .single();
  const isAuthor = serviceUser.id === ticket.created_by;
  console.log(serviceUser);
  const {
    created_at,
    title,
    description,
    created_by,
    status,
    author_name,
    assignee,
  } = ticket;

  const dateString = new Date(created_at).toLocaleString("en-US");
  return (
    <article>
      <TicketDetails
        params={params}
        id={id}
        tenant={ticket.tenant}
        title={title}
        description={description}
        status={status}
        author_name={author_name}
        dateString={dateString}
        isAuthor={isAuthor}
        assignee={assignee}
      />
      <TicketComments />
    </article>
  );
}
