export const dynamic = "force-dynamic";

import AppShell from "@/components/layout/AppShell";
import BusinessNav from "@/components/istream/BusinessNav";
import CatalogueManager from "@/components/istream/CatalogueManager";
import { getBusinessManagementData } from "@/lib/actions/quotation.actions";

export default async function CataloguePage() {
  const { catalogue } = await getBusinessManagementData();
  return <AppShell title="Istream Business">
    <BusinessNav />
    <div style={{ marginBottom: 20 }}><h1 style={{ margin: 0 }}>Catalogue &amp; Pricing</h1><p style={{ color: "#94A3B8" }}>Control item codes, descriptions and standard prices used by quotations.</p></div>
    <CatalogueManager items={catalogue} />
  </AppShell>;
}
