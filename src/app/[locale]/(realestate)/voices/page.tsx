import { CustomerVoicesPage, customerVoicesMetadata } from "@/components/shared/CustomerVoicesPage";

export async function generateMetadata() {
  return customerVoicesMetadata("realestate");
}

export default function Page() {
  return <CustomerVoicesPage businessKey="realestate" />;
}
