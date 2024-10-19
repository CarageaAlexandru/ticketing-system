import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";

export default async function UserList({ tenant }) {
  const supabase = getSupabaseCookiesUtilClient();
  // we have defined access to the data inside the function in postgresql
  let { data: users, error } = await supabase.rpc("get_tenant_userlist", {
    tenant_id: tenant,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Job title
                  </th>
                  {/*<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">*/}
                  {/*  <span*/}
                  {/*    scope="col"*/}
                  {/*    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"*/}
                  {/*  >*/}
                  {/*    Edit*/}
                  {/*  </span>*/}
                  {/*</th>*/}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((person) => (
                  <tr key={person.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <span
                        className={`
      ${person.is_available ? "text-gray-900" : "text-red-500 line-through"}
    `}
                      >
                        {person.full_name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.job_title}
                    </td>
                    {/*<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">*/}
                    {/*  <a*/}
                    {/*    href="#"*/}
                    {/*    className="text-indigo-600 hover:text-indigo-900"*/}
                    {/*  >*/}
                    {/*    Edit<span className="sr-only">, {person.name}</span>*/}
                    {/*  </a>*/}
                    {/*</td>*/}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
