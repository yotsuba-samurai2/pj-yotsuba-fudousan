import { CustomerVoicesPage, customerVoicesMetadata } from "@/components/shared/CustomerVoicesPage";

export async function generateMetadata() {
  return customerVoicesMetadata("labor");
}

export default function Page() {
  return <CustomerVoicesPage businessKey="labor" />;
}
