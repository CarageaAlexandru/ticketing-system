"use client";
import {
  CalendarDaysIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { TICKET_STATUS } from "@/utils/constants";
import { getSupabaseBrowserClient } from "@/supabase-utils/browser-client";
import { urlPath } from "@/utils/url-helper";
import { useRouter } from "next/navigation";

export default function TicketDetails({
  params,
  tenant,
  id,
  status,
  title,
  description,
  author_name,
  dateString,
  isAuthor,
}) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
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
          <div className="flex self-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {TICKET_STATUS[status]}
            </dd>
            {isAuthor && (
              <button
                onClick={() => {
                  supabase
                    .from("tickets")
                    .delete()
                    .eq("id", id)
                    .then(() => {
                      router.push(urlPath("/tickets", tenant));
                    });
                }}
                type="button"
                className="rounded-full ml-2  bg-red-600 p-2 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <TrashIcon aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
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
