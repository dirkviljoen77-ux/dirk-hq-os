export const dynamic = "force-dynamic";

import AppShell from "@/components/layout/AppShell";
import BusinessNav from "@/components/istream/BusinessNav";
import ClientsManager from "@/components/istream/ClientsManager";
import { getBusinessManagementData } from "@/lib/actions/quotation.actions";

export default async function ClientsPage() {
  const { clients } = await getBusinessManagementData();
  return <AppShell title="Istream Business">
    <BusinessNav />
    <div style={{ marginBottom: 20 }}><h1 style={{ margin: 0 }}>Clients</h1><p style={{ color: "#94A3B8" }}>Maintain client details once and reuse them on quotations.</p></div>
    <ClientsManager clients={clients} />
  </AppShell>;
}
