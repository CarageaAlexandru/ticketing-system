import Link from "next/link";
import { Alert } from "@/components/Alert";
import { ErrorMessage } from "@/components/ErrorMessage";
import { urlPath } from "@/utils/url-helper";

export default function ErrorPage({ searchParams, params }) {
  const { type } = searchParams;
  const errorMessages = {
    "login-failed": [
      "Your login attempt failed. Please check your credentials and try again.",
    ],
    magiclink: [
      "Could not send a magic link. Maybe you had a typo in your E-Mail?",
    ],
    notRegistered: [
      "Could not send a magic link - the user must be registered first.",
    ],
    invalid_magiclink: [
      "The magic link was invalid. Maybe it expired? Please request a new one.",
    ],
    register_mail_mismatch: [
      `You are not legitimated to register an account with: ${searchParams.email}
      `,
    ],
    register_mail_exists: [
      `There is already an account registered with: ${searchParams.email}`,
    ],
    register_unknown: [
      "Sorry but an unknown error occurred when trying to create an account.",
    ],
    page_out_of_range: [
      "The requested page does not exist. Please go back to the first page and try again.",
    ],
  };
  const getErrorContent = () => {
    if (errorMessages[type]) {
      return <Alert messages={errorMessages[type]} />;
    } else {
      return <ErrorMessage />;
    }
  };
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="text-base font-semibold sm:text-5xl text-indigo-600">
          Oops
        </h1>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Something went wrong
        </h2>

        {getErrorContent()}

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={urlPath("/", params.tenant)}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
