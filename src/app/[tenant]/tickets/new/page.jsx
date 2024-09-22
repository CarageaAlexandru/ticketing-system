"use client";
import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/Spinner";
import { getSupabaseBrowserClient } from "@/supabase-utils/browser-client";
import { urlPath } from "@/utils/url-helper";
import { useRouter } from "next/navigation";
import { delay } from "@/utils/constants";

export default function CreateTicket({ params }) {
  const { tenant } = params;
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const ticketTitleRef = useRef(null);
  const ticketDescriptionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    router.prefetch(urlPath(`/tickets/details/[id]`));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = ticketTitleRef.current.value;
    const description = ticketDescriptionRef.current.value;
    // we have database validation as well, title check < 4 - keep in mind
    if (title.trim().length > 4 && description.trim().length > 20) {
      setIsLoading(true);
      await delay(2000);
      // we have created a trigger in order to populate the mandatory created_by field. Database -> triggers tr_
      supabase
        .from("tickets")
        .insert({
          title,
          description,
          tenant,
        })
        .select()
        .single()
        .then(({ error, data }) => {
          if (error) {
            setIsLoading(false);
            alert("There was an error , could not create the ticket.");
            console.error(error);
          } else {
            router.push(urlPath(`/tickets/details/${data.id}`, tenant));
          }
        });

      setIsLoading(false);
    } else {
      alert("A title must have at least 5 char and a description at least 20.");
    }
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create a new ticket
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
            <div className="mt-2">
              <input
                disabled={isLoading}
                ref={ticketTitleRef}
                id="title"
                name="title"
                type="text"
                placeholder="Enter title"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              disabled={isLoading}
              ref={ticketDescriptionRef}
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Write a few sentences about the problem.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            disabled={isLoading}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? <Spinner /> : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
