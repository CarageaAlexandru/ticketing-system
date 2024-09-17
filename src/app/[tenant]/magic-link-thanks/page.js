import { urlPath } from "@/utils/url-helper";
import SuccessMessage from "@/components/SuccessMessage";

export default function MagicLinkSuccessPage({ params }) {
  const { tenant } = params;
  return (
    <SuccessMessage
      tenant={tenant}
      title="Magic on its way!"
      message="Thanks! You should get a link to login in a few seconds."
      buttonText="Go back to homepage"
      buttonHref={urlPath("/", tenant)}
    />
  );
}
