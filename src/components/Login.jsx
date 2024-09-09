"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { useRef } from "react";
import { getSupabaseBrowserClient } from "@/supabase-utils/browser-client";
import { useRouter } from "next/navigation";
import { urlPath } from "@/utils/url-helper";
import { FORM_TYPES } from "@/app/[tenant]/formTypes";

export const Login = ({ formType = "password-login", tenant, tenantName }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const getPath = (subPath) => urlPath(subPath ?? "", tenant);

  const isPasswordLogin = formType === FORM_TYPES.PASSWORD_LOGIN;
  const isMagicLinkLogin = formType === FORM_TYPES.MAGIC_LINK;
  console.log(isPasswordLogin);

  const formAction = getPath(
    isPasswordLogin ? `/password-login` : `/magic-link`,
  );
  const loginBasePath = getPath();

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mt-5">
            {tenantName}
          </h1>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {isPasswordLogin && (
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    ref={passwordRef}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            {isPasswordLogin ? (
              <Link
                href={{
                  pathname: loginBasePath,
                  query: { magicLink: "yes" },
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go To Magic Link Login
              </Link>
            ) : (
              <Link
                href={{
                  pathname: loginBasePath,
                  query: { magicLink: "no" },
                }}
                className="flex w-full justify-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Go to Password Login
              </Link>
            )}

            <div>
              <button
                type="submit"
                className={clsx(
                  "flex w-full justify-center rounded-md px-3 py-1.5 text-sm text-black font-semibold leading-6  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  {
                    "bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:outline-indigo-600":
                      !isPasswordLogin,
                    "rounded-md bg-white px-3 py-2 text-sm  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50":
                      isPasswordLogin,
                  },
                )}
              >
                Sign in with {isPasswordLogin ? "Password" : "Magic Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
