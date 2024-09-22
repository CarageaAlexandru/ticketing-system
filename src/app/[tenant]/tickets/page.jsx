import TicketList from "@/components/TicketList";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import Pagination from "@/components/Pagination";
import { fetchTickets } from "@/lib/data";
import { ErrorMessage } from "@/components/ErrorMessage";
import { buildUrl, urlPath } from "@/utils/url-helper";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TicketsPage({ params, searchParams }) {
  const { tenant } = params;
  const itemsPerPage = 3;
  const page = Number(searchParams.page || 1);
  const { tickets, count, error } = await fetchTickets(
    tenant,
    page,
    itemsPerPage,
  );
  // follow the same pattern with the errors.
  if (error) {
    if (error.message.includes("Requested range not satisfiable")) {
      redirect(urlPath(`/error?type=page_out_of_range`, tenant));
    }
    //   for not specific errors we're curently not handling generic message
    return <ErrorMessage message={error.message} />;
  }
  const totalPages = Math.ceil(count / itemsPerPage);
  return (
    <div className="px-4 py-5 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tickets</h1>

      <TicketList tickets={tickets} tenant={params.tenant} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={count}
        itemsPerPage={itemsPerPage}
        tenant={tenant}
      />
    </div>
  );
}
