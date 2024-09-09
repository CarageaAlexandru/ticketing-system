import { XCircleIcon } from "@heroicons/react/20/solid";

export function ErrorMessage() {
  return (
    <div className="rounded-md bg-red-50 p-4 mt-2">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              <li>
                Something went wrong. Please try again or contact support.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
