import { CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { notFound } from "next/navigation";
import { TICKET_STATUS } from "@/utils/constants";

export default async function TicketDetails({ params }) {
  const supabase = getSupabaseCookiesUtilClient();
  const id = Number(params.id);
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return notFound();
  // we have created a trigger for author name - keep in mind
  const { title, description, status, author_name, created_at } = ticket;
  const dateString = new Date(created_at).toLocaleString("en-UK");

  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h2 className="sr-only">Summary</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Ticket #{id}
              </h3>
            </dt>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {TICKET_STATUS[status]}
            </dd>
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Client</span>
              <UserCircleIcon
                aria-hidden="true"
                className="h-6 w-5 text-gray-400"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {author_name}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Created at</span>
              <CalendarDaysIcon
                aria-hidden="true"
                className="h-6 w-5 text-gray-400"
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              <time dateTime="2023-01-31">{dateString}</time>
            </dd>
          </div>
        </dl>
        <div className="flex-auto pl-6 pt-6">
          <dt className="text-sm font-semibold leading-6 text-gray-900">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h3>
          </dt>
        </div>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
          <section>{description}</section>
        </div>
      </div>
    </div>
  );
}
