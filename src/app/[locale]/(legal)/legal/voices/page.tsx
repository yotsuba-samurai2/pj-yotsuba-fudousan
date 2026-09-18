import { CustomerVoicesPage, customerVoicesMetadata } from "@/components/shared/CustomerVoicesPage";

export async function generateMetadata() {
  return customerVoicesMetadata("legal");
}

export default function Page() {
  return <CustomerVoicesPage businessKey="legal" />;
}
