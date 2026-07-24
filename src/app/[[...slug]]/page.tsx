import { ClientOnly } from "./client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function Page() {
  return <ClientOnly />;
}
