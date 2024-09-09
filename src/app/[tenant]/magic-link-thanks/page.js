import MagicLinkThanks from "@/components/MagicLinkThanks";

export default function MagicLinkSuccessPage({ params }) {
  return <MagicLinkThanks tenant={params.tenant} />;
}
