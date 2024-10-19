"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/supabase-utils/browser-client";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function AssigneeSelect({ tenant, onValueChanged, initialValue }) {
  const [users, setUsers] = useState(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase
      .rpc("get_tenant_userlist", {
        tenant_id: tenant,
      })
      .then(({ data }) => {
        setUsers(data ?? []);
      });
  }, [tenant, supabase]);

  return (
    <div>
      <select
        name="assignee"
        disabled={users === null}
        value={initialValue ?? ""}
        onChange={(e) => {
          onValueChanged(e.target.value);
        }}
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        <option value="">
          {users === null ? "Loading..." : "No assignee"}
        </option>
        {users &&
          users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name}
            </option>
          ))}
      </select>
    </div>
  );
}
