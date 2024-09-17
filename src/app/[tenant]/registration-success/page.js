import { urlPath } from "@/utils/url-helper";
import SuccessMessage from "@/components/SuccessMessage";

export default function RegistrationSuccessPage({ searchParams, params }) {
  const { email } = searchParams;
  const { tenant } = params;

  return (
    <SuccessMessage
      tenant={tenant}
      title="Registration Succeeded"
      message={`Check your email (${email}) for a link to activate your account.`}
      buttonText="Go to Login"
      buttonHref={urlPath("/", tenant)}
    />
  );
}
